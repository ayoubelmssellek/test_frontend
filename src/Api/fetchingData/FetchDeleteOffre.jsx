import Api from '../../Axios/Api';

export  const fetchingDeleteOffre = async (IdOffre) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.delete(`/offres/${IdOffre}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};