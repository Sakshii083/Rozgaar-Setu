import API from "./axios";

export const getWorkerStats = () =>
  API.get("/worker-dashboard");