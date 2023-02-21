import axios from "axios";

const API_URL = "http://localhost:8010/api/auth/";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "login", {email, password})
      .then(response => {
        const tokenLength = [131,132,133];
        const userRole = ["USER","ADMIN","COMPANY"]
        if (response.data != null && tokenLength.includes(response.data.token.length) &&
            userRole.includes(response.data.role)) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(email, password, userRole) {
    return axios.post(API_URL + "signup", {email, password, userRole});
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
