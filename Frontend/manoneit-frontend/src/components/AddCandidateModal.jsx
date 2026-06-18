import { useState } from "react";
import { createCandidate } from "../services/candidateApi";

const AddCandidateModal = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const token = localStorage.getItem("accessToken");

    const [formData, setFormData] = useState({
        clientCompany: "",
        vertical: "",
        function: "",
        candidateName: "",
        currentCompany: "",
        currentCTC: "",
        expectedCTC: "",
        age: "",
        contact: "",
        email: "",
        qualification: "",
        experience: "",
        designation: "",
        location: "",
        noticePeriod: "",
        preferredLocation: "",
        status: "",
        feedback: "",
    });

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
            await createCandidate(
                formData,
                token
            );

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        }


    };

    if (!isOpen) return null;

    return (<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">


        <div className="bg-white rounded-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                    Add Candidate
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
                    placeholder="Client Company"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="vertical"
                    placeholder="Vertical"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="function"
                    placeholder="Function"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="candidateName"
                    placeholder="Candidate Name"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="currentCompany"
                    placeholder="Current Company"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="currentCTC"
                    placeholder="Current CTC"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="expectedCTC"
                    placeholder="Expected CTC"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="age"
                    placeholder="Age"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="contact"
                    placeholder="Contact"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="qualification"
                    placeholder="Qualification"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="experience"
                    placeholder="Experience"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="designation"
                    placeholder="Designation"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="noticePeriod"
                    placeholder="Notice Period"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="preferredLocation"
                    placeholder="Preferred Location"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="status"
                    placeholder="Status"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="feedback"
                    placeholder="Feedback"
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <div className="col-span-3 flex justify-end">

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded"
                    >
                        Save Candidate
                    </button>

                </div>

            </form>

        </div>

    </div>


    );
};

export default AddCandidateModal;
