import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import {
  getCandidates,
  deleteCandidate,
  updateStatusFeedback,
  importCandidates,
} from "../services/candidateApi";

import AddCandidateModal from "../components/AddCandidateModal";
import EditCandidateModal from "../components/EditCandidateModal";

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewCandidate, setViewCandidate] = useState(null);

  const [filters, setFilters] = useState({
    clientCompany: "",
    vertical: "",
    function: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const limit = 20;
  const token = localStorage.getItem("accessToken");

  // Clean filters before sending to backend
  const getCleanFilters = (filt) => {
    const clean = {};
    if (filt.clientCompany?.trim()) clean.clientCompany = filt.clientCompany.trim();
    if (filt.vertical?.trim()) clean.vertical = filt.vertical.trim();
    if (filt.function?.trim()) clean.function = filt.function.trim();
    return clean;
  };

  const fetchCandidates = async (overrideFilters = null, newPage = 1) => {
    try {
      setLoading(true);
      setPage(newPage);

      const currentFilters = overrideFilters || filters;
      const cleanFilters = getCleanFilters(currentFilters);

      const params = {
        ...cleanFilters,
        limit: limit,
        page: newPage,
        sort: "-createdAt",
      };

      const response = await getCandidates(params, token);
      const candidateData = Array.isArray(response?.data) ? response.data : [];

      setCandidates(candidateData);
      setHasMore(candidateData.length === limit); // Enable Next only if full page is returned
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const searchCandidates = async (value) => {
    try {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      const response = await getCandidates({ search: value, limit: 20 }, token);
      setSearchResults(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImport = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      await importCandidates(file, token);

      alert("Candidates imported successfully");

      fetchCandidates(null, 1);
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  };

  const exportToExcel = () => {
    const data = candidates.map((candidate) => ({
      Vertical: candidate.vertical,
      Function: candidate.function,
      CandidateName: candidate.candidateName,
      CurrentCompany: candidate.currentCompany,
      CurrentCTC: candidate.currentCTC,
      ExpectedCTC: candidate.expectedCTC,
      Age: candidate.age,
      Contact: candidate.contact,
      Email: candidate.email,
      Qualification: candidate.qualification,
      Experience: candidate.experience,
      Designation: candidate.designation,
      Location: candidate.location,
      NoticePeriod: candidate.noticePeriod,
      PreferredLocation: candidate.preferredLocation,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "Candidates.xlsx");
  };

  const handleStatusFeedbackUpdate = async (id, status, feedback) => {
    try {
      await updateStatusFeedback(id, { status, feedback }, token);
      fetchCandidates(null, page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmed) return;
    try {
      await deleteCandidate(id, token);
      fetchCandidates(null, page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async () => {
    setFilters({ clientCompany: "", vertical: "", function: "" });
    setSearchTerm("");
    setSearchResults([]);
    setShowSuggestions(false);
    setPage(1);
    fetchCandidates({}, 1);
  };

  const handleCandidateSelect = async (candidate) => {
    try {
      setSearchTerm(candidate.candidateName);
      setShowSuggestions(false);
      const response = await getCandidates({ search: candidate.candidateName, limit: 20 }, token);
      setCandidates(Array.isArray(response?.data) ? response.data : []);
      setPage(1);
      setHasMore(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = (candidate) => {
    setViewCandidate(candidate);
    setViewModalOpen(true);
  };

  const goToNextPage = () => hasMore && fetchCandidates(null, page + 1);
  const goToPrevPage = () => page > 1 && fetchCandidates(null, page - 1);

  useEffect(() => {
    fetchCandidates(null, 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCandidates(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Database</h1>
          <p className="text-gray-600 mt-1">Manage and track all your candidates</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm">
            📥 Import Excel
            <input type="file" accept=".xlsx,.xls" hidden onChange={handleImport} />
          </label>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            📤 Export Excel
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm font-medium"
          >
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Candidate, Company, Contact, Email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-base"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setShowSuggestions(false);

                fetchCandidates(null, 1);
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          )}
        </div>

        {showSuggestions && searchTerm && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-50 py-2">
            {searchResults.map((candidate) => (
              <div
                key={candidate._id}
                className="px-5 py-3 hover:bg-indigo-50 cursor-pointer transition-colors mx-1 rounded-xl"
                onMouseDown={() => handleCandidateSelect(candidate)}
              >
                <div className="font-semibold text-gray-900">{candidate.candidateName}</div>
                <div className="text-sm text-gray-600">{candidate.designation} • {candidate.currentCompany}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Client Company"
            value={filters.clientCompany}
            onChange={(e) => setFilters({ ...filters, clientCompany: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Vertical"
            value={filters.vertical}
            onChange={(e) => setFilters({ ...filters, vertical: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Function"
            value={filters.function}
            onChange={(e) => setFilters({ ...filters, function: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-end gap-3">
            <button onClick={() => fetchCandidates(null, 1)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-all">
              Apply Filters
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Vertical</th>
                <th className="p-4 text-left font-semibold text-gray-700">Function</th>
                <th className="p-4 text-left font-semibold text-gray-700">Candidate Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Current Company</th>
                <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-24">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading candidates...</p>
                    </div>
                  </td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="text-6xl mb-4">📂</div>
                      <h3 className="text-xl font-semibold text-gray-800">No Candidates Found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{candidate.vertical}</td>
                    <td className="p-4 text-gray-600">{candidate.function}</td>
                    <td className="p-4">
                      <div className="font-semibold">{candidate.candidateName}</div>
                      <div className="text-xs text-gray-500">{candidate.designation}</div>
                    </td>
                    <td className="p-4 text-gray-700">{candidate.currentCompany}</td>
                    <td className="p-4 text-gray-600">{candidate.email}</td>
                    <td className="p-4">
                      <input
                        type="text"
                        defaultValue={candidate.status || ""}
                        onBlur={(e) => handleStatusFeedbackUpdate(candidate._id, e.target.value, candidate.feedback)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-40 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(candidate)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium">View</button>
                        <button onClick={() => { setSelectedCandidate(candidate); setEditModalOpen(true); }} className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-1.5 rounded-lg text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(candidate._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && candidates.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={goToPrevPage}
                disabled={page === 1}
                className="px-5 py-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={!hasMore}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && viewCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Candidate Details</h2>
                <button onClick={() => setViewModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div><strong>Vertical:</strong> {viewCandidate.vertical}</div>
                <div><strong>Function:</strong> {viewCandidate.function}</div>
                <div><strong>Candidate Name:</strong> {viewCandidate.candidateName}</div>
                <div><strong>Designation:</strong> {viewCandidate.designation}</div>
                <div><strong>Current Company:</strong> {viewCandidate.currentCompany}</div>
                <div><strong>Client Company:</strong> {viewCandidate.clientCompany || "N/A"}</div>
                <div><strong>Email:</strong> {viewCandidate.email}</div>
                <div><strong>Contact:</strong> {viewCandidate.contact}</div>
                <div><strong>Current CTC:</strong> {viewCandidate.currentCTC}</div>
                <div><strong>Expected CTC:</strong> {viewCandidate.expectedCTC}</div>
                <div><strong>Age:</strong> {viewCandidate.age}</div>
                <div><strong>Qualification:</strong> {viewCandidate.qualification}</div>
                <div><strong>Experience:</strong> {viewCandidate.experience}</div>
                <div><strong>Location:</strong> {viewCandidate.location}</div>
                <div><strong>Preferred Location:</strong> {viewCandidate.preferredLocation}</div>
                <div><strong>Notice Period:</strong> {viewCandidate.noticePeriod}</div>
                <div><strong>Status:</strong> {viewCandidate.status || "N/A"}</div>
                <div className="md:col-span-2">
                  <strong>Feedback:</strong>
                  <p className="mt-1 bg-gray-50 p-4 rounded-2xl">{viewCandidate.feedback || "No feedback available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddCandidateModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => fetchCandidates(null, 1)}
      />

      <EditCandidateModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        onSuccess={() => fetchCandidates(null, page)}
      />
    </div>
  );
};

export default CandidateManagement;