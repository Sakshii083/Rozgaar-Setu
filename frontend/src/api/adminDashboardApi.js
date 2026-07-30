import API from "./axios";

export const getAdminStats = () =>
  API.get("/admin/stats");