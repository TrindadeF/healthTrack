import api from "./api";

export const getLoggedUser = async () => {
  const response = await api.get("/user/logged");
  return response.data;
};

export const getUsers = async (filters: { role?: string }) => {
  const response = await api.get("/users", { params: filters });
  return response.data;
};
