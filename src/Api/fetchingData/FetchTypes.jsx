import Api from '../../Axios/Api';

export  const fetchingTypes = async () => {
      try{
        const response = await Api.get('/type',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


