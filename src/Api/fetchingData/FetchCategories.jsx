import Api from '../../Axios/Api';

export  const fetchingCategories = async () => {
      try{
        const response = await Api.get('/categorie',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


