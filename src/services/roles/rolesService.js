import api from "utils/api";

export const addRole = async (roleData) => {
  try {
    const response = await api.post("roles", roleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    // Extract meaningful error message
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to add role.";

    throw new Error(errorMessage);
  }
};

export const getRoles = async () => {
  try {
    const response = await api.get("roles/allRoles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to fetch roles.";

    throw new Error(errorMessage);
  }
};

export const getRolesWithPermissions = async () => {
  try {
    const response = await api.get("roles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to fetch roles with permissions.";

    throw new Error(errorMessage);
  }
};
