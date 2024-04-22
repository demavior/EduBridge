import axios from 'axios';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../App';

export const LogoutPage = async (navigate) => {
    const token = Cookies.get('token');
    console.log('Token:', token);
    try {
        await axios.post('http://127.0.0.1:8000/user/logout/', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });
        showSuccessNotification('Logged out successfully');
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        navigate('/');
    } catch (error) {
        showErrorNotification('Unable to logout');
    }
};

export default LogoutPage;
