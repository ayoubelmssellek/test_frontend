import Api from '../../Axios/Api';

export  const fetchingManagers = async () => {
      try{
        const response = await Api.get('/managers',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


