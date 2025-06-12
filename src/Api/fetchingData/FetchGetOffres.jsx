import Api from '../../Axios/Api';

export  const fetchingOffres = async () => {
      try{
        const response = await Api.get('/offres',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }
};


