import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    clientCompany: {
      type: String,
      required: true,
      trim: true,
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    ctc: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    invoiceDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "cleared"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);