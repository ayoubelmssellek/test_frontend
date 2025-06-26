import Api from '../../Axios/Api';

export  const fetchingEmployees = async () => {
      try{
        const response = await Api.get('/employees',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


