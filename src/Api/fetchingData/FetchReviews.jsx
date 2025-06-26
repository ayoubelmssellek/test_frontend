import Api from "../../Axios/Api";

export const FetchingListReviews = async () => {
    try {
        const response = await Api.get('/getallreviews', {
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
    }