// src/models/Payroll.js
const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      // 1–12
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    creditedOn: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED"],
      default: "PAID",
    },
    // Optional breakdown – useful later for reports if you want
    components: {
      basic: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "payrolls",
  }
);

// One payroll record per user per month
payrollSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);

module.exports = Payroll;
