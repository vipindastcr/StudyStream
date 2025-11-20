
import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/users/register", data);
  return response.data;
};
