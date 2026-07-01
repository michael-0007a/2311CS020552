export const API_BASE_URL =
  import.meta.env.VITE_EVALUATION_BASE_URL || "http://20.244.56.144/evaluation-service";

export const REGISTER_URL =
  import.meta.env.VITE_REGISTER_URL || `${API_BASE_URL}/register`;

export const AUTH_URL =
  import.meta.env.VITE_AUTH_URL || `${API_BASE_URL}/auth`;

export const LOG_URL =
  import.meta.env.VITE_LOG_URL || `${API_BASE_URL}/logs`;

export const NOTIFICATIONS_URL =
  import.meta.env.VITE_NOTIFICATIONS_URL || `${API_BASE_URL}/notifications`;

export const studentDetails = {
  email: import.meta.env.VITE_EMAIL,
  name: import.meta.env.VITE_NAME,
  mobileNo: import.meta.env.VITE_MOBILE_NO,
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME,
  rollNo: import.meta.env.VITE_ROLL_NO,
  accessCode: import.meta.env.VITE_ACCESS_CODE,
};

export const savedCredentials = {
  clientID: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
};
