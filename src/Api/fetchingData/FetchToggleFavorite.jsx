import Api from "../../Axios/Api";

export const fetchingToggleFavorite = async (ProductID) => {
  const token = localStorage.getItem("authToken"); 
  try {
    const response = await Api.post(`/favorite/${ProductID}`,{},{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating favorite status:", error);
    throw error;
  }
};