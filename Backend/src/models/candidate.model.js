import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    clientCompany: {
      type: String,
      // required: true,
      default: "",
      trim: true,
    },


    vertical: {
      type: String,
      required: true,
      trim: true,
    },

    function: {
      type: String,
      required: true,
      trim: true,
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    currentCompany: {
      type: String,
      default: "",
      trim: true,
    },

    currentCTC: {
      type: String,
      default: "",
      trim: true,
    },

    expectedCTC: {
      type: String,
      default: "",
      trim: true,
    },

    age: {
      type: Number,
    },

    contact: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    noticePeriod: {
      type: String,
      default: "",
      trim: true,
    },

    preferredLocation: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      default: "",
      trim: true,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Candidate",
  candidateSchema
);
