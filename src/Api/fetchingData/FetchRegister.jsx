import Api from '../../Axios/Api';

export  const fetchRegister = async (newUser) => {
      try{
        const response = await Api.post('/register',newUser);
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }

};


