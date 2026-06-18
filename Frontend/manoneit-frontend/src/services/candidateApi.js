import axios from "axios";

/* ================= GET ALL CANDIDATES ================= */

export const getCandidates = async (
  filters,
  token
) => {
  const response = await axios.get(
    "/api/v1/users/candidates",
    {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= GET SINGLE CANDIDATE ================= */

export const getCandidateById = async (
  id,
  token
) => {
  const response = await axios.get(
    `/api/v1/users/candidates/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= CREATE CANDIDATE ================= */

export const createCandidate = async (
  candidateData,
  token
) => {
  const response = await axios.post(
    "/api/v1/users/candidates/create",
    candidateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= UPDATE CANDIDATE ================= */

export const updateCandidate = async (
  id,
  candidateData,
  token
) => {
  const response = await axios.put(
    `/api/v1/users/candidates/${id}`,
    candidateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= DELETE CANDIDATE ================= */

export const deleteCandidate = async (
  id,
  token
) => {
  const response = await axios.delete(
    `/api/v1/users/candidates/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= UPDATE STATUS & FEEDBACK ================= */

export const updateStatusFeedback = async (
  id,
  data,
  token
) => {
  const response = await axios.patch(
    `/api/v1/users/candidates/status-feedback/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ================= IMPORT CANDIDATES ================= */

export const importCandidates = async (
  file,
  token
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    "/api/v1/users/candidates/import",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};