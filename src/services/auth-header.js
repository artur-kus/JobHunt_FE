export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return {
      "Accept": 'application/json',
      "Authorization": 'Bearer ' + user.token,
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
      // "Access-Control-Max-Age": 86400,
      // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
    };
  } else {
    return {
      "Accept": 'application/json',
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
    };
  }
}
