import api from "../api/axios.js";

export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};
