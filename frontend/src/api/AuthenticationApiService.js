import apiClient from "./apiClient";

export const executeJwtAuthenticationService = (email, password) =>
  apiClient.post(`/auth/login`, { email, password });

export const generatePayroll = async (userId, year, month) => {
  const response = await apiClient.post(
    `/payroll/generate/${userId}/${year}/${month}`
  );
  return response.data;
};

export const getPayrollByUser = async (userId) => {
  const response = await apiClient.get(`/payroll/${userId}`);
  return response.data;
};
