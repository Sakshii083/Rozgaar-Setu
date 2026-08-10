import API from "./axios";

export const getEmployerStats = async () => {
  return await API.get("/dashboard/employer");
};