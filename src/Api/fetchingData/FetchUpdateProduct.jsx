import Api from "../../Axios/Api";
export const fetchingUpdateProduct = async (ProductId, updatedData) => {
    const token = localStorage.getItem('authToken');
  try {
    const response = await Api.post(`/product/${ProductId}`,updatedData,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",

        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}




