import Api from "../../Axios/Api";
export const fetchingUpdateType = async (typeId, updatedData) => {
    const token = localStorage.getItem('authToken');
  try {
    const response = await Api.put(`/type/${typeId}`, updatedData,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating type:", error);
    throw error;
  }
}




