import Api from '../../Axios/Api';

export  const fetchingDeleteCategory = async (IdCategory) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.delete(`/categorie/${IdCategory}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};