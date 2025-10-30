import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_APPLICATION_BACKEND_URL;

export const apiFetch = async (endpoint: any, method = 'GET', body = null) => {
    const token = Cookies.get('token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
    };

    const res = await fetch(`${API_URL}${endpoint}`,{
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();
    if(!res.ok) { toast.error(data.message) ; throw new Error(data.message || 'API error'); }else{ toast.success(data.message)}

    return data;
}