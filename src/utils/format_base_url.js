export const formatBaseUrl = () => {
    const useLocal = true
    let baseUrl;
    if (process.env.NODE_ENV === 'development') {
        if (useLocal) {
            baseUrl = 'http://localhost:3000'
        } else {

            baseUrl = 'https://bsw-be-api.onrender.com'
        }
    } else {
        baseUrl = 'https://bsw-be-api.onrender.com';
    }
    return baseUrl;
};


