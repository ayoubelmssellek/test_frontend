import Api from '../../Axios/Api';

export  const fetchingSubscriptionsStatistics = async () => {
      try{
        const response = await Api.get('/subscriptions',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


