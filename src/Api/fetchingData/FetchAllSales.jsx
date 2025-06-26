import Api from '../../Axios/Api';

export  const fetchingSales = async () => {
      try{
        const response = await Api.get('/sales',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


