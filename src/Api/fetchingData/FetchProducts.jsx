import Api from '../../Axios/Api';

export const fetchingProducts = async () => {
  try {
    const response = await Api.get('/product', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "حدث خطأ غير متوقع";

    throw new Error(message); // ✅ نرمي error فيها message فقط
  }
};
