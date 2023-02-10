import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8010/api/jobs/';

class JobService {

    findAll() {
        return axios.post(API_URL + 'findAll', { headers: authHeader(), body: {} });
    }

    create() {
        return axios.get(API_URL + 'create', { headers: authHeader() });
    }

    get() {
        return axios.get(API_URL + 'get', { headers: authHeader() });
    }

    edit() {
        return axios.get(API_URL + 'edit', { headers: authHeader() });
    }

    delete() {
        return axios.get(API_URL + 'delete', { headers: authHeader() });
    }


}

export default new JobService();
