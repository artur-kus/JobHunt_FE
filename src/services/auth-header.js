export const authHeader = (zip = false) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = {
        "Accept": 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
    };

    if (user && user.token) {
        headers.Authorization = 'Bearer ' + user.token;
        if (zip) {
            headers["Content-Type"] = 'application/zip';
            headers.ResponseType = 'application/attachment';
        }
    }

    return headers;
};
