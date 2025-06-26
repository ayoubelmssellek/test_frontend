import Api from '../../Axios/Api';

export  const fetchingAddEmployee = async (newEmployee) => {
     const token = localStorage.getItem('authToken');
      try{
        const response = await Api.post('/employees',newEmployee,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


