import Api from '../../Axios/Api';

export  const fetchingDeleteType = async (IdType) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.delete(`/type/${IdType}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};