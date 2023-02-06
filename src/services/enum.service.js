import axios from "axios";

const API_URL = "http://localhost:8010/api/enum/";

class EnumService {
    getUserRoles() {
        return axios.get(API_URL + 'user-roles');
    }
}

export default new EnumService();