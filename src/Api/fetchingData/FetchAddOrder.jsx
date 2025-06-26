import Api from '../../Axios/Api';

export const fetchingAddOrder = async (newOrder) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/order',newOrder,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }
};