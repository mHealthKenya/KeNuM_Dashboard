import api from "utils/api";

export const addUser = async (userData) => {
  try {
    const response = await api.post("users/add", userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    // Extract meaningful error message
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to add user.";

    throw new Error(errorMessage);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("users/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users.");
  }
};

export const updateUser = async (id, updatedData) => {
  try {
    if (!id) {
      throw new Error("User ID is missing or invalid.");
    }

    const response = await api.patch(
      "users/update",
      { id, ...updatedData },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to update user.";

    throw new Error(errorMessage);
  }
};
