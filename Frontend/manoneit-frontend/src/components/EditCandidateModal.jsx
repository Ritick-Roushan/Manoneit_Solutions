import { useEffect, useState } from "react";
import { updateCandidate } from "../services/candidateApi";

const EditCandidateModal = ({
isOpen,
onClose,
candidate,
onSuccess,
}) => {
const token = localStorage.getItem("accessToken");

const [formData, setFormData] = useState({});

useEffect(() => {
if (candidate) {
setFormData(candidate);
}
}, [candidate]);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]:
e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  await updateCandidate(
    candidate._id,
    formData,
    token
  );

  onSuccess();
  onClose();
} catch (error) {
  console.error(error);
}


};

if (!isOpen || !candidate) return null;

return ( <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">


  <div className="bg-white w-full max-w-6xl p-6 rounded-xl max-h-[90vh] overflow-y-auto">

    <div className="flex justify-between mb-4">

      <h2 className="text-xl font-bold">
        Edit Candidate
      </h2>

      <button
        onClick={onClose}
        className="text-red-500"
      >
        ✕
      </button>

    </div>

    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >

      <input
        name="clientCompany"
        value={formData.clientCompany || ""}
        placeholder="Client Company"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="vertical"
        value={formData.vertical || ""}
        placeholder="Vertical"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="function"
        value={formData.function || ""}
        placeholder="function"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="candidateName"
        value={formData.candidateName || ""}
        placeholder="Candidate Name"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="currentCompany"
        value={formData.currentCompany || ""}
        placeholder="Current Company"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="currentCTC"
        value={formData.currentCTC || ""}
        placeholder="Current CTC"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="expectedCTC"
        value={formData.expectedCTC || ""}
        placeholder="Expected CTC"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="experience"
        value={formData.experience || ""}
        placeholder="Experience"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="status"
        value={formData.status || ""}
        placeholder="Status"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="feedback"
        value={formData.feedback || ""}
        placeholder="Feedback"
        onChange={handleChange}
        className="border p-2 rounded col-span-3"
        rows={4}
      />

      <div className="col-span-3 flex justify-end">

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update Candidate
        </button>

      </div>

    </form>

  </div>

</div>


);
};

export default EditCandidateModal;
