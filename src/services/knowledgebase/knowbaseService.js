import api from "utils/api";

// const FILE_BASE_URL = "http://localhost";

// Fetch all knowledge base articles
export const getAllArticles = async () => {
  try {
    const response = await api.get("knowledge-base", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data.map((article) => ({
      ...article,
      downloadLink:
        article.file && article.file.includes("/uploads/")
          ? article.file.split("/uploads/").pop()
          : article.file || "unknown-file",
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch articles.");
  }
};

// Add a new article with category
export const addArticle = async (title, files, categoryId, createdById) => {
  try {
    if (!title || !files || !categoryId || !createdById) {
      throw new Error("Missing required fields: title, file, categoryId, or createdById.");
    }

    const allowedTypes = ["application/pdf"];
    if (files.type && !allowedTypes.includes(files.type)) {
      throw new Error("Invalid file type. Please upload a PDF.");
    }

    const formData = new FormData();
    formData.append("title", title);
    // formData.append("description", description || ""); // Ensure description is not undefined
    formData.append("files", files);
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
