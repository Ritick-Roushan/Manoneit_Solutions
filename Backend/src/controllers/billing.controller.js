import Billing from "../models/billing.model.js";
import { asyncHandler } from "../utils/asynchandler.js";

/* ================= CREATE BILLING ================= */
const createBilling = asyncHandler(async (req, res) => {
  const { clientCompany, candidates, invoiceDate } = req.body;

  if (!clientCompany || !Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }

  // FIX: ensure valid date
  const validDate = invoiceDate ? new Date(invoiceDate) : new Date();

  const billingData = candidates.map((c) => ({
    clientCompany,
    candidateName: c.candidateName,
    ctc: Number(c.ctc),
    percentage: Number(c.percentage),
    amount: Number(c.amount),
    invoiceDate: validDate,
    status: "pending",
  }));

  const created = await Billing.insertMany(billingData);

  return res.status(201).json({
    success: true,
    data: created,
    message: "Billing saved successfully",
  });
});

/* ================= DELETE BILLING ================= */
const deleteBilling = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Billing.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Billing not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Billing deleted successfully",
  });
});

/* ================= UPDATE STATUS ================= */
const updateBillingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  //  validation
  if (!["pending", "cleared"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const updated = await Billing.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Billing not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: updated,
  });
});

/* ================= DASHBOARD ================= */
const getBillingDashboard = asyncHandler(async (req, res) => {
  const { fy } = req.query;

  let matchStage = {};

  //  Financial Year Filter
  if (fy) {
    const [startYear, endYear] = fy.split("-").map(Number);

    if (!startYear || !endYear) {
      return res.status(400).json({
        success: false,
        message: "Invalid financial year format",
      });
    }

    const startDate = new Date(startYear, 3, 1);
    const endDate = new Date(endYear, 2, 31, 23, 59, 59);

    matchStage = {
      invoiceDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  const result = await Billing.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,

              totalAmount: { $sum: "$amount" },
              totalCandidates: { $sum: 1 },

              clearedAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "cleared"] },
                    "$amount",
                    0,
                  ],
                },
              },

              pendingAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "pending"] },
                    "$amount",
                    0,
                  ],
                },
              },
            },
          },
        ],

        companyWise: [
          {
            $group: {
              _id: "$clientCompany",

              totalAmount: { $sum: "$amount" },
              totalCandidates: { $sum: 1 },

              clearedAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "cleared"] },
                    "$amount",
                    0,
                  ],
                },
              },

              pendingAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "pending"] },
                    "$amount",
                    0,
                  ],
                },
              },

              candidates: {
                $push: {
                  id: "$_id",
                  name: "$candidateName",
                  amount: "$amount",
                  ctc: "$ctc",
                  status: { $ifNull: ["$status", "pending"] },
                },
              },
            },
          },
          { $sort: { totalAmount: -1 } },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: {
      overall: result[0]?.overall[0] || {
        totalAmount: 0,
        totalCandidates: 0,
      },
      companyWise: result[0]?.companyWise || [],
    },
  });
});

export {
  createBilling,
  deleteBilling,
  updateBillingStatus,
  getBillingDashboard,
};