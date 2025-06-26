import Api from "../../Axios/Api";




export  const fetchOrderById = async (orderId) => {
      try{
        const response = await Api.get(`/order/${orderId}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


