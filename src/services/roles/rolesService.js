import api from "utils/api";

export const addRole = async (roleData) => {
  try {
    console.log("Sending role data:", roleData);
    const response = await api.post("roles", roleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

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

export const updateRole = async (roleId, roleData) => {
  try {
    console.log("Updating role with:", { roleId, roleData });
    const response = await api.patch(`roles/${roleId}`, roleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Error ${error.response?.status}: ${error.message}` ||
      "Failed to update role.";

    throw new Error(errorMessage);
  }
};
