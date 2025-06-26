import Api from '../../Axios/Api';

export  const fetchingAddReview= async (newReview) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/review',newReview,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


