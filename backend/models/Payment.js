const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  projectName: {
    type: String,
  },
  items: [
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      image: {
        type: String,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  amountInPaise: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  mode: {
    type: String,
    enum: ["razorpay", "demo"],
    required: true,
  },
  method: {
    type: String,
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  paidAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
