import API from "./axios";

export const getJobs = () => API.get("/jobs");

export const getJobById = (id) => API.get(`/jobs/${id}`);

export const createJob = (data) => API.post("/jobs", data);

export const deleteJob = (id) => API.delete(`/jobs/${id}`);