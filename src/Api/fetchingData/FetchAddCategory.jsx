import Api from '../../Axios/Api';

export  const fetchingAddCategory = async (newCategory) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/categorie',newCategory,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


