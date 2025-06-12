import Api from "../../Axios/Api";
export const fetchingUpdateOrderStatus = async (orderId, updatedData) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await Api.patch(`/orderstatut/${orderId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};