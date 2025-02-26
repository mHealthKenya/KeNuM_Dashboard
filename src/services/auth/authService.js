import api from "utils/api";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("users/login", { email, password });

      if (response.data.token && response.data.role) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed. Please try again.";
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
  },

  getCurrentUser: () => {
    return {
      token: localStorage.getItem("authToken"),
      role: localStorage.getItem("role"),
    };
  },
};

export default AuthService;
