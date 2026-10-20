import API from "./axios";

export const getEmployers = (search = "", city = "") =>
  API.get("/users/employers", {
    params: {
      search,
      city,
    },
  });