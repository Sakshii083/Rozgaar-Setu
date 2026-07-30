import axios from "axios";

const API = "http://localhost:5000/api/stats";

export const getStats = async () => {
  return await axios.get(API);
};