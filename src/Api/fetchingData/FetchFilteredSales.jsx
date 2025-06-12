import Api from '../../Axios/Api';

export const fetching_filtred_sales= async (timeFilter) => {
  try {
    const response = await Api.get('/sales/by-filters', {
      params: { range: timeFilter },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
