// fetchlogout.js
import Api from "../../Axios/Api";
const fetchLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token");
    
    try {
        const response = await Api.post(
        "/logout",
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
        // نرمي خطأ واضح باش نستعملو من برا
        throw new Error("Unauthorized");
        }
        throw error;
    }
    }