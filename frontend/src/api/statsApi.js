import API from "./axios";

export const getStats = async () => {
  return await API.get("/stats");
};