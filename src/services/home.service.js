import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8010/api/dashboard/';

class JobService {

    findAllJobs() {
        return axios.post(API_URL + 'findAllJobs', { headers: authHeader(), body: {} });
    }
}

export default new JobService();