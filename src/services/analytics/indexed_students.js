import axios from "axios";

export const getIndexed_Students = async () => {
  try {
    const response = await axios.get(
      "https://aya-api.mhealthkenya.co.ke/api/dashboard/indexed_students"
    );
    console.log("Indexed Students response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Indexed Students");
  }
};
