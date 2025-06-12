// FetchChangeReviewStatus.jsx
import Api from '../../Axios/Api';

export const fetchingUpdateReviewsStatus = async ({ id, formdata }) => {
  try {
    const response = await Api.patch(`/UpdateStatusReview/${id}`, formdata, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating type:", error);
    throw error.response?.data || error;
  }
};      