import Api from '../../Axios/Api';

export  const fetchingAdminInformations = async () => {
      try{
        const response = await Api.get('/AdminInformations',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


