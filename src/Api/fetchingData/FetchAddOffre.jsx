import Api from '../../Axios/Api';

export  const fetchingAddOffre = async (newOffre) =>{
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/offres',newOffre,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


