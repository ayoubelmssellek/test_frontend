import Api from "../../Axios/Api";
export const fetchingUpdateProductStatus = async (ProductId, newStatus) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await Api.patch(`/product/${ProductId}`, newStatus, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};