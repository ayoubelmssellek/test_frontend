import Api from '../../Axios/Api';


export const fetching_sales_by_type = async (days = 0) => {
  try {
    const response = await Api.get('/sales/top-types', {
      params: { days }, // تمرير عدد الأيام
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

