import axios from "axios";

export function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Starts checkout for a single project or list of cart project IDs.
 * Opens Razorpay Checkout if configured or triggers onDemoOrder for Test Mode.
 */
export async function startCheckout({
  projectId,
  projectIds,
  amount,
  description,
  currentUser,
  onDemoOrder,
  onSuccess,
  onError,
  onFinally,
}) {
  try {
    const { data } = await axios.post("/api/payments/create-order", {
      projectId,
      projectIds,
      amount,
      currency: "INR",
    });

    if (data.mode === "demo") {
      onDemoOrder(data);
      onFinally?.();
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      throw new Error(
        "Unable to load Razorpay Checkout script. Please check your connection."
      );
    }

    const options = {
      key: data.keyId,
      amount: data.amountInPaise,
      currency: data.currency || "INR",
      name: "HackBazzer",
      description: description || data.projectName || "Project Purchase",
      order_id: data.orderId,
      prefill: currentUser
        ? {
            name: currentUser.username,
            email: currentUser.email,
          }
        : undefined,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post("/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            method: "razorpay",
          });
          onSuccess(
            verifyRes.data?.payment || {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: data.amount,
              currency: data.currency || "INR",
              mode: "razorpay",
            }
          );
        } catch (verifyErr) {
          onError(
            verifyErr.response?.data?.error ||
              verifyErr.message ||
              "Payment succeeded but verification failed."
          );
        } finally {
          onFinally?.();
        }
      },
      modal: {
        ondismiss: () => {
          onFinally?.();
        },
      },
      theme: {
        color: "#7c3aed",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      onError(resp?.error?.description || "Payment failed. Please try again.");
      onFinally?.();
    });
    rzp.open();
  } catch (err) {
    onError(
      err.response?.data?.error ||
        err.message ||
        "Unable to initiate payment. Please try again."
    );
    onFinally?.();
  }
}
