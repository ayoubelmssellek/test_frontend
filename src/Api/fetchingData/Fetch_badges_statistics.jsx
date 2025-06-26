import Api from '../../Axios/Api';

export  const fetching_badges_statistics = async () => {
      try{
        const response = await Api.get('/badges_statistics',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


