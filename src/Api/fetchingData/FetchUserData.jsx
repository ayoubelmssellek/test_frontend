// src/Api/fetchingData/FetchUserData.js
import Api from "../../Axios/Api";

export const fetchingUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token");

  try {
    const response = await Api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // نرمي خطأ واضح باش نستعملو من برا
      throw new Error("Unauthorized");
    }
    throw error;
  }
};
