import Api from "../../Axios/Api";

export const fetchAllOrders = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await Api.get('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.orders || response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};