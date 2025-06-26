import Api from '../../Axios/Api';

export  const fetchingAddType = async (newType) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/type',newType,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


