import api from "utils/api";

const FILE_BASE_URL = "http://localhost/uploads/";

// Fetch all knowledge base articles
export const getAllArticles = async () => {
  try {
    const response = await api.get("knowledge-base", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data.map((article) => ({
      ...article,
      downloadLink: FILE_BASE_URL + article.file.split("/uploads/").pop(),
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch articles.");
  }
};

// Add a new article with category
export const addArticle = async (title, description, file, categoryId, createdById) => {
  try {
    if (!title || !file || !categoryId || !createdById) {
      throw new Error("Missing required fields: title, file, categoryId, or createdById.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || ""); // Ensure description is not undefined
    formData.append("file", file);
    formData.append("categoryId", categoryId);
    formData.append("createdById", createdById);

    console.log("Uploading article with formData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    const response = await api.post("knowledge-base/add", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to upload article.");
  }
};

// Fetch all categories

export const getAllCategories = async () => {
  try {
    const response = await api.get("knwb-category", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories.");
  }
};

export const addCategory = async (catData) => {
  try {
    const response = await api.post("knwb-category", catData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add Category.");
  }
};
