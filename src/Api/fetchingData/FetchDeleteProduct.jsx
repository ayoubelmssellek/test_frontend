import Api from '../../Axios/Api';

export  const fetchingDeleteProduct = async (IdProduct) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.delete(`/product/${IdProduct}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};