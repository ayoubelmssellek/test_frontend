import Api from '../../Axios/Api';

export  const fetching_sales_statistic = async () => {
      try{
        const response = await Api.get('/sales/sales_statistic',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


