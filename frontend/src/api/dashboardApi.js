import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

export const getEmployerStats = async () => {
  return await axios.get(`${API}/employer`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};