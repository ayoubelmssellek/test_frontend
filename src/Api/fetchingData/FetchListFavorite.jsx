import Api from "../../Axios/Api";

export const FetchingListFavorites = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await Api.get("/favorites", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};