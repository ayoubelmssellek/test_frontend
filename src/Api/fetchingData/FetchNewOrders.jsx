
import Api from "../../Axios/Api";
 const fetchNewOrders = async () => {
        const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("No authentication token found");
    }
    try {
        const response = await Api.get("/new-orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export default fetchNewOrders;