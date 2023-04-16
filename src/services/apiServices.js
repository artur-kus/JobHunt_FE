import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8010/api/';

export const userService = {
    getPublicContent: () => {
        return axios.get(`${API_URL}test/all`);
    },
    getUserBoard: () => {
        return axios.get(`${API_URL}test/user`, { headers: authHeader() });
    },
    getCompanyBoard: () => {
        return axios.get(`${API_URL}test/company`, { headers: authHeader() });
    },
    getAdminBoard: () => {
        return axios.get(`${API_URL}test/admin`, { headers: authHeader() });
    }
};

export const homeService = {
    getJobDetails: (jobId) => {
        return axios.get(`${API_URL}home/job/get?id=${jobId}`, {})
            .then(response => response.data)
            .catch(error => {
                console.error(error);
                return {};
            });
    },
    findAllJobs: (page) => {
        return axios.post(`${API_URL}home/findAllJobs`, { body: {}, page: page }, {})
            .then(response => response.data)
            .catch(error => {
                console.error(error);
                return [];
            });
    }
};

export const enumService = {
    getUserRoles: () => {
        return axios.get(`${API_URL}enum/user-roles`);
    }
};

export const authService = {
    login: (email, password) => {
        return axios.post(`${API_URL}auth/login`, { email, password })
            .then(response => {
                const tokenLength = [131, 132, 133];
                const userRole = ["USER", "ADMIN", "COMPANY"];
                if (response.data != null && tokenLength.includes(response.data.token.length) &&
                    userRole.includes(response.data.role)) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    },
    logout: () => {
        localStorage.removeItem("user");
    },
    register: (email, password, userRole) => {
        return axios.post(`${API_URL}auth/signup`, { email, password, userRole });
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export const candidateService = {
    findAll: () => {
        return axios.post(`${API_URL}candidates/findAll`, { body: {} }, { headers: authHeader() });
    },
    create: () => {
        return axios.get(`${API_URL}candidates/create`, { headers: authHeader() });
    },
    get: () => {
        return axios.get(`${API_URL}candidates/get`, { headers: authHeader() });
    },
    edit: () => {
        return axios.get(`${API_URL}candidates/edit`, { headers: authHeader() });
    },
    delete: () => {
        return axios.get(`${API_URL}candidates/delete`, { headers: authHeader() });
    }
};