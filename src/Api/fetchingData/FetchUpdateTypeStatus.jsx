import Api from "../../Axios/Api";
export const fetchingUpdateTypeStatus = async (typeId, updatedData) => {
    const token = localStorage.getItem('authToken');
  try {
    const response = await Api.patch(`/UpdateStatusType/${typeId}`, updatedData,{
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




