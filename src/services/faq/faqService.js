import api from "utils/api";

export const getAllFaqs = async () => {
  try {
    const response = await api.get("faqs/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch FAQs.");
  }
};

export const addFaq = async (faqData) => {
  try {
    const response = await api.post("faqs/add", faqData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add FAQ.");
  }
};
