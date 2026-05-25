import axios from "axios";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080") + "/api/auth";

const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Register Error:", error);

    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Status:", error.response.status);
    }

    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Save token if backend returns JWT
    if (response.data.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    return response.data;

  } catch (error) {
    console.error("Login Error:", error);

    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Status:", error.response.status);
    }

    throw error;
  }
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  getCurrentUser,
  logout,
};

export default authService;