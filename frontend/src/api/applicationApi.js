import API from "./axios";

export const applyJob = (payload) => {
  const data = typeof payload === "object" ? payload : { jobId: payload };
  return API.post("/applications/apply", data);
};

export const getEmployerApplications = () =>
  API.get("/applications");

export const getWorkerApplications = () =>
  API.get("/applications/my");

export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}`, { status });
