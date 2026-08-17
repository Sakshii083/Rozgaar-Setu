import API from "./axios";

export const getWorkerStats = () =>
  API.get("/worker-dashboard");

export const searchWorkers = (skill, city) =>
  API.get("/workers/search", {
    params: {
      skill,
      city,
    },
  });
  