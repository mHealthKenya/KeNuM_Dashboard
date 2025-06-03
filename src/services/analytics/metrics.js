import axios from "axios";

export const getMetrics = async () => {
  try {
    const response = await axios.get("https://aya-api.mhealthkenya.co.ke/api/dashboard/metrics");
    console.log("Metrics response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to Fetch Metrics.");
  }
};

export const getExamApplicationMetrics = async () => {
  try {
    const response = await axios.get(
      "https://aya-api.mhealthkenya.co.ke/api/dashboard/exam_applications"
    );
    console.log("Exam Application Metrics response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to Fetch Exam Application Metrics.");
  }
};

export const getInternshipApplicationMetrics = async () => {
  try {
    const response = await axios.get(
      "https://aya-api.mhealthkenya.co.ke/api/dashboard/internship_applications"
    );
    console.log("Internship Application Metrics response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to Fetch Internship Application Metrics."
    );
  }
};

export const getExamResultsMetrics = async () => {
  try {
    const response = await axios.get(
      "https://aya-api.mhealthkenya.co.ke/api/dashboard/exam_results"
    );
    console.log("Exam Results Metrics response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to Fetch Exam Results Metrics.");
  }
};

export const getInternshipPostingsMetrics = async () => {
  try {
    const response = await axios.get(
      "https://aya-api.mhealthkenya.co.ke/api/dashboard/internship_postings"
    );
    console.log("Internship Postings Metrics response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to Fetch Internship Postings Metrics."
    );
  }
};
