import api from "utils/api";

export const addPermission = async (permissionData) => {
  try {
    const response = await api.post("permissions", permissionData, {
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
      "Failed to add permission.";

    throw new Error(errorMessage);
  }
};

export const getPermissions = async () => {
  try {
    const response = await api.get("permissions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to fetch permissions.";

    throw new Error(errorMessage);
  }
};

export const deletePermission = async (permissionId) => {
  try {
    await api.delete(`permissions/${permissionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to delete permission.";

    throw new Error(errorMessage);
  }
};
