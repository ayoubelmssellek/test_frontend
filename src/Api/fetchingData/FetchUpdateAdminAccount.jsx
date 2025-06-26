import Api from "../../Axios/Api";
export const fetchingUpdateAdminAccount = async (AdminId, updatedData) => {
    const token = localStorage.getItem('authToken');
  try {
    const response = await Api.put(`/UpdateAdminAccount/${AdminId}`, updatedData,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating Admin Account:", error);
    throw error;
  }
}




