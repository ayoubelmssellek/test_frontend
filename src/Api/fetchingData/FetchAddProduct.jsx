import Api from '../../Axios/Api';

export  const fetchingAddProduct = async (newProduct) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/product',newProduct,{
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


