import Candidate from "../models/candidate.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import XLSX from "xlsx";

/* ================= CREATE CANDIDATE ================= */

const createCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.create(req.body);

  return res.status(201).json({
    success: true,
    data: candidate,
    message: "Candidate created successfully",
  });
});

/* ================= GET CANDIDATES ================= */
const getCandidates = asyncHandler(async (req, res) => {
  const {
    clientCompany,
    vertical,
    function: func,
    search,
    limit = 20,
    page = 1,
    sort = "-createdAt",
  } = req.query;

  let filter = {};

  // Filters (case-insensitive)
  if (clientCompany) {
    filter.clientCompany = { $regex: clientCompany, $options: "i" };
  }
  if (vertical) {
    filter.vertical = { $regex: vertical, $options: "i" };
  }
  if (func) {
    filter.function = { $regex: func, $options: "i" };
  }

  // Global Search
  if (search) {
    filter.$or = [
      { candidateName: { $regex: search, $options: "i" } },
      { currentCompany: { $regex: search, $options: "i" } },
      { contact: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { qualification: { $regex: search, $options: "i" } },
      { experience: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { preferredLocation: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
      { feedback: { $regex: search, $options: "i" } },
    ];
  }

  const limitNumber = parseInt(limit) || 20;
  const pageNumber = parseInt(page) || 1;
  const skip = (pageNumber - 1) * limitNumber;

  const candidates = await Candidate.find(filter)
    .sort(sort)           // e.g., "-createdAt"
    .skip(skip)           // ← Very Important
    .limit(limitNumber);

  return res.status(200).json({
    success: true,
    count: candidates.length,
    page: pageNumber,
    limit: limitNumber,
    data: candidates,
  });
});

/* ================= GET SINGLE CANDIDATE ================= */

const getCandidateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const candidate = await Candidate.findById(id);

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: candidate,
  });
});

/* ================= UPDATE CANDIDATE ================= */

const updateCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedCandidate = await Candidate.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCandidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedCandidate,
    message: "Candidate updated successfully",
  });
});

/* ================= UPDATE STATUS & FEEDBACK ================= */

const updateStatusFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  const candidate = await Candidate.findByIdAndUpdate(
    id,
    {
      status,
      feedback,
    },
    {
      new: true,
    }
  );

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: candidate,
    message: "Status updated successfully",
  });
});

/* ================= DELETE CANDIDATE ================= */

const deleteCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCandidate = await Candidate.findByIdAndDelete(id);

  if (!deletedCandidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Candidate deleted successfully",
  });
});

/* ================= IMPORT CANDIDATES ================= */

const importCandidates = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Excel file is required",
    });
  }

  const workbook = XLSX.read(req.file.buffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet);

  if (!rows.length) {
    return res.status(400).json({
      success: false,
      message: "Excel file is empty",
    });
  }

  const formattedRows = rows.map((row) => ({
    clientCompany: row.ClientCompany || "",
    vertical: row.Vertical,
    function: row.Function,
    candidateName: row.CandidateName,
    currentCompany: row.CurrentCompany || "",
    currentCTC: row.CurrentCTC || "",
    expectedCTC: row.ExpectedCTC || "",
    age: row.Age,
    contact: row.Contact || "",
    email: row.Email || "",
    qualification: row.Qualification || "",
    experience: row.Experience || "",
    designation: row.Designation || "",
    location: row.Location || "",
    noticePeriod: row.NoticePeriod || "",
    preferredLocation: row.PreferredLocation || "",
    status: row.Status || "",
    feedback: row.Feedback || "",
  }));

  await Candidate.insertMany(formattedRows);

  return res.status(200).json({
    success: true,
    count: formattedRows.length,
    message: "Candidates imported successfully",
  });
});

export {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  updateStatusFeedback,
  importCandidates,
};
