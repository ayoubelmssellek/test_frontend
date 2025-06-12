import Api from "../../Axios/Api";


export const FetchReviewsById = async (id) => {
    try {
        const response = await Api.get(`/reviews/${id}`, {

        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
    }