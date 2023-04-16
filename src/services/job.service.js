import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8010/api/dashboard/';

export const getJobDetails = (jobId) => {
    return axios.get(`${API_URL}job/get?id=${jobId}`)
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            return {};
        });
}

export const findAllJobs = (page) => {
    return axios.post(`${API_URL}findAllJobs`, { body: {}, page: page })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            return [];
        });
}