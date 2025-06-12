import axios from 'axios';

const Api = axios.create({
baseURL: '/api', // كل الطلبات تبدأ من /api (عشان البروكسي في dev أو التوجيه في production)
withCredentials: true,
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json',
},
});



export default Api;
