import API from "./axios";

export const applyJob = (data) =>
  API.post("/applications/apply", data);

export const getEmployerApplications = () =>
  API.get("/applications");

export const getWorkerApplications = () =>
  API.get("/applications/my");

export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}`, { status });