const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Project = require("../models/Project");

const router = express.Router();

/**
 * Reads Razorpay credentials from environment variables and reports whether
 * real (non-placeholder) keys are configured.
 */
function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.REZORPAY_KEY_SECRET ||
    ""
  ).trim();

  const isConfigured = Boolean(
    keyId &&
      keySecret &&
      !keyId.toLowerCase().includes("placeholder") &&
      !keySecret.toLowerCase().includes("placeholder")
  );

  return { keyId, keySecret, isConfigured };
}

/**
 * Resolves line items and authoritative total price from MongoDB for either a
 * single projectId or a list of cart projectIds.
 */
async function resolveOrderItems({ projectId, projectIds, amount }) {
  const ids = Array.isArray(projectIds) && projectIds.length > 0
    ? projectIds
    : projectId
      ? [projectId]
      : [];

  if (ids.length === 0) {
    return {
      finalAmount: Number(amount),
      projectName: "",
      resolvedProjectId: undefined,
      items: [],
    };
  }

  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid project ID");
      err.statusCode = 400;
      throw err;
    }
  }

  const projects = await Project.find({ _id: { $in: ids } });
  const byId = new Map(projects.map((p) => [String(p._id), p]));

  const items = [];
  let total = 0;
  for (const id of ids) {
    const proj = byId.get(String(id));
    if (!proj) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }
    const price = Number(proj.price);
    total += price;
    items.push({
      projectId: proj._id,
      name: proj.name,
      price,
      image: proj.image,
    });
  }

  const projectName =
    items.length === 1
      ? items[0].name
      : `${items[0].name} + ${items.length - 1} more`;

  return {
    finalAmount: total,
    projectName,
    resolvedProjectId: items.length === 1 ? items[0].projectId : undefined,
    items,
  };
}

/**
 * Creates a Razorpay order when credentials are configured, or a test/demo
 * order in MongoDB when placeholder credentials are present.
 */
async function createOrderHandler(req, res) {
  try {
    const { projectId, projectIds, amount, currency = "INR" } = req.body || {};
    const { finalAmount, projectName, resolvedProjectId, items } =
      await resolveOrderItems({ projectId, projectIds, amount });

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      return res.status(400).json({ error: "Valid payment amount is required" });
    }

    const normalizedCurrency = String(currency || "INR").trim().toUpperCase();
    const amountInPaise = Math.round(finalAmount * 100);
    if (amountInPaise < 100) {
      return res
        .status(400)
        .json({ error: "Minimum payable amount is 1.00" });
    }

    const receipt = `rcpt_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const { keyId, keySecret, isConfigured } = getRazorpayConfig();

    const baseDoc = {
      projectId: resolvedProjectId,
      projectName,
      items,
      userId: req.user?._id,
      amount: finalAmount,
      amountInPaise,
      currency: normalizedCurrency,
      status: "created",
    };

    if (isConfigured) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: normalizedCurrency,
        receipt,
      });

      await Payment.create({
        ...baseDoc,
        orderId: order.id,
        mode: "razorpay",
      });

      return res.status(201).json({
        mode: "razorpay",
        orderId: order.id,
        amount: finalAmount,
        amountInPaise,
        currency: normalizedCurrency,
        keyId,
        projectName,
        items,
      });
    }

    const demoOrderId = `order_demo_${crypto.randomBytes(8).toString("hex")}`;
    await Payment.create({
      ...baseDoc,
      orderId: demoOrderId,
      mode: "demo",
    });

    return res.status(201).json({
      mode: "demo",
      orderId: demoOrderId,
      amount: finalAmount,
      amountInPaise,
      currency: normalizedCurrency,
      projectName,
      items,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const description =
      error?.error?.description || error?.message || "Error creating order";
    return res
      .status(error?.statusCode || 500)
      .json({ error: description });
  }
}

router.post("/create-order", createOrderHandler);

router.post("/verify", async (req, res) => {
  try {
    const body = req.body || {};
    const orderId = body.orderId || body.razorpay_order_id;
    const paymentId = body.paymentId || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;
    const method = body.method;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        payment,
      });
    }

    if (payment.mode === "razorpay") {
      if (!paymentId || !signature) {
        return res
          .status(400)
          .json({ error: "Missing Razorpay payment verification parameters" });
      }

      const { keySecret } = getRazorpayConfig();
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const expectedBuf = Buffer.from(expectedSignature, "utf8");
      const receivedBuf = Buffer.from(String(signature), "utf8");
      const isValid =
        expectedBuf.length === receivedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, receivedBuf);

      if (!isValid) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({ error: "Invalid payment signature" });
      }

      payment.paymentId = paymentId;
      payment.signature = signature;
      payment.method = method || "razorpay";
    } else {
      payment.paymentId =
        paymentId || `pay_demo_${crypto.randomBytes(8).toString("hex")}`;
      payment.method = method || "demo";
    }

    if (!payment.userId && req.user?._id) {
      payment.userId = req.user._id;
    }

    payment.status = "paid";
    payment.paidAt = new Date();
    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error verifying payment" });
  }
});

router.get("/my-orders", async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res
        .status(401)
        .json({ error: "Please log in to view your orders" });
    }

    const orders = await Payment.find({
      userId: req.user._id,
      status: "paid",
    })
      .populate("projectId", "name description github demo image category price")
      .populate(
        "items.projectId",
        "name description github demo image category price"
      )
      .sort({ paidAt: -1, createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    return res.status(200).json({ payment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { router, createOrderHandler };
