import { useEffect, useState } from "react";

const BillingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fy, setFy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState({});

  const [form, setForm] = useState({
    clientCompany: "",
    candidateName: "",
    ctc: "",
    percentage: "",
    invoiceDate: "",
  });

  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => `${currentYear - i}-${currentYear - i + 1}`);
  };

  const fetchData = () => {
    setLoading(true);
    const url = fy ? `/api/v1/users/billing/dashboard?fy=${fy}` : `/api/v1/users/billing/dashboard`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fy]);

  const handleAdd = async () => {
    if (!form.clientCompany || !form.candidateName || !form.ctc || !form.percentage || !form.invoiceDate) {
      alert("Fill all fields");
      return;
    }

    const base = (Number(form.ctc) * Number(form.percentage)) / 100;
    const gst = Math.round(base * 0.18);

    await fetch("/api/v1/users/billing/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientCompany: form.clientCompany,
        invoiceDate: form.invoiceDate,
        candidates: [{
          candidateName: form.candidateName,
          ctc: form.ctc,
          percentage: form.percentage,
          amount: Math.round(base + gst)
        }],
      }),
    });

    setForm({ clientCompany: "", candidateName: "", ctc: "", percentage: "", invoiceDate: "" });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await fetch(`/api/v1/users/billing/${id}`, { method: "DELETE" });
    fetchData();
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/v1/users/billing/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };


  const toggleCompanyView = (companyName) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyName]: !prev[companyName],
    }));
  };

  const getVisibleCandidates = (company) => {
    return expandedCompanies[company._id]
      ? company.candidates
      : company.candidates.slice(0, 5);
  };

  const filteredCompanies = data?.companyWise?.map((company) => {
    const companyMatch = company._id.toLowerCase().includes(search.toLowerCase());
    const filteredCandidates = company.candidates.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    if (companyMatch) return company;
    if (filteredCandidates.length > 0) return { ...company, candidates: filteredCandidates };
    return null;
  }).filter(Boolean) || [];

  const companyCount = filteredCompanies.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !data || data.companyWise.length === 0;
  const isFYSelected = fy !== "";

  // Empty State
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-md">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mb-8 text-5xl">
            📊
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {isFYSelected ? `No data for FY ${fy}` : "No Billing Records Yet"}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {isFYSelected 
              ? "Try selecting a different financial year." 
              : "Get started by adding your first billing entry."}
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg mx-auto hover:shadow-xl transition-all active:scale-95"
          >
            <span className="text-2xl">+</span> Add New Billing
          </button>

          {isFYSelected && (
            <button
              onClick={() => setFy("")}
              className="mt-6 text-blue-600 hover:text-blue-700 underline"
            >
              ← Show All Years
            </button>
          )}
        </div>

        {/* Form also works in Empty State */}
        {showForm && (
          <div className="mt-10 w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">📋 Add New Billing Entry</h2>
                <button onClick={() => setShowForm(false)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-700">Client Company</label>
                  <input placeholder="e.g. KEC International Ltd." value={form.clientCompany} onChange={(e) => setForm({ ...form, clientCompany: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-700">Candidate Name</label>
                  <input placeholder="Full Name" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-700">CTC (₹)</label>
                  <input placeholder="1500000" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-700">Percentage (%)</label>
                  <input placeholder="8.5" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-medium text-gray-700">Invoice Date</label>
                  <input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
                </div>
              </div>

              <button onClick={handleAdd} className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-base">
                Add Billing Entry
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard (when data exists)
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pt-6">

        {/* Overall Billing */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Overall Billing</h2>
              <p className="text-blue-200 text-sm">FY Summary</p>
            </div>
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-semibold">₹{Number(data.overall.totalAmount).toLocaleString("en-IN")}</p>
              <p className="text-blue-200 text-sm">Total Billed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6">
              <p className="text-emerald-300 font-medium text-sm sm:text-base">Cleared</p>
              <p className="text-2xl sm:text-3xl font-semibold mt-1 text-emerald-100">₹{Number(data.overall.clearedAmount || 0).toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6">
              <p className="text-rose-300 font-medium text-sm sm:text-base">Pending</p>
              <p className="text-2xl sm:text-3xl font-semibold mt-1 text-rose-100">₹{Number(data.overall.pendingAmount || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Filters + New Billing */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <select value={fy} onChange={(e) => setFy(e.target.value)} className="border border-gray-300 px-5 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64">
            <option value="">All Financial Years</option>
            {getFinancialYears().map((year) => <option key={year} value={year}>FY {year}</option>)}
          </select>

          <div className="relative flex-1 w-full">
            <input placeholder="Search company or candidate..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-300 px-5 py-3.5 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <span className="text-xl">+</span> New Billing
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div id="add-form" className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">📋 Add New Billing Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">Client Company</label>
                <input placeholder="e.g. KEC International Ltd." value={form.clientCompany} onChange={(e) => setForm({ ...form, clientCompany: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">Candidate Name</label>
                <input placeholder="Full Name" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">CTC (₹)</label>
                <input placeholder="1500000" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">Percentage (%)</label>
                <input placeholder="8.5" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-medium text-gray-700">Invoice Date</label>
                <input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} className="w-full border border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3" />
              </div>
            </div>

            <button onClick={handleAdd} className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-base">
              Add Billing Entry
            </button>
          </div>
        )}

        {/* Company List */}
        <div className={`grid gap-6 ${companyCount === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {filteredCompanies.map((company, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              {/* Company Header & Candidates... (same as before) */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 text-white">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg sm:text-xl">{company._id}</h3>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {company.candidates.length} Candidate{company.candidates.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 mt-5 text-sm">
                  <div><p className="text-emerald-400 font-semibold">₹{Number(company.totalAmount).toLocaleString("en-IN")}</p><p className="text-gray-400 text-xs">TOTAL</p></div>
                  <div><p className="text-emerald-400 font-semibold">₹{Number(company.clearedAmount || 0).toLocaleString("en-IN")}</p><p className="text-gray-400 text-xs">CLEARED</p></div>
                  <div><p className="text-rose-400 font-semibold">₹{Number(company.pendingAmount || 0).toLocaleString("en-IN")}</p><p className="text-gray-400 text-xs">PENDING</p></div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {getVisibleCandidates(company).map((c, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-base">{c.name}</p>
                        <p className="text-gray-500 text-sm">CTC: ₹{Number(c.ctc).toLocaleString("en-IN")}</p>
                      </div>
                      <p className="font-mono font-semibold text-lg">₹{Number(c.amount).toLocaleString("en-IN")}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                      <select value={c.status || "pending"} onChange={(e) => updateStatus(c.id, e.target.value)} className={`px-5 py-2.5 rounded-xl text-sm font-medium border w-full sm:w-auto transition-all ${c.status === "cleared" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                        <option value="pending">Pending</option>
                        <option value="cleared">Cleared</option>
                      </select>

                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-all w-full sm:w-auto">
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}

                {company.candidates.length > 5 && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => toggleCompanyView(company._id)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      {expandedCompanies[company._id]
                        ? "Show Less"
                        : `View All (${company.candidates.length})`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;