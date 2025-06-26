import Api from '../../Axios/Api';

export  const fetchingDeleteManager= async (managerId) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.delete(`/managers/${managerId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};