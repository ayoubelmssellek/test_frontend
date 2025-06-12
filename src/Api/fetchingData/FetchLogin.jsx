import Api from '../../Axios/Api';

export const loginUser = async (loginData) => {
        try{
        const response = await Api.post('/login',loginData);
        return response.data;
      }catch (error) {
        throw error.response?.data || error;
     }
};
