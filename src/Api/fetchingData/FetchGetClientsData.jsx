import Api from '../../Axios/Api';

export  const fetchingClientsData = async () => {
      try{
        const response = await Api.get('/clients',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


