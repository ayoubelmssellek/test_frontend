import Api from "../../Axios/Api";

export const fetchingAddManager = async (newManager) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await Api.post('/add_manager', newManager, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        // تحسين معالجة الأخطاء
        if (error.response) {
            throw {
                message: error.response.data.message || 'حدث خطأ',
                errors: error.response.data.errors || {},
                status: error.response.status
            };
        } else {
            throw { message: 'اتصال بالشبكة غير متاح' };
        }
    }
};