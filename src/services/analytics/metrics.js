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
