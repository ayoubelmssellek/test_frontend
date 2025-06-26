import Api from "../../Axios/Api";
export const fetchingUpdateCategory = async (CategoryId, updatedData) => {
    const token = localStorage.getItem('authToken');
  try {
    const response = await Api.post(`/categorie/${CategoryId}`,updatedData,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",

        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}




