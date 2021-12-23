import axios from 'axios';

function errorResponseHandler(error) {
  if (error.response) {
    const { status } = error.response;
    const message =
      error.response.data.details ||
      error.response.data.message ||
      error.response.data.errorMessage ||
      error.response.data.error;
    const reject = {
      status,
      message,
    };

    if (status === 404) {
      return Promise.reject(reject);
    }

    if (status === 401 || status === 403) {
      return Promise.reject(error.response);
    }

    return Promise.reject(reject);
  }
  if (error.request) {
    return Promise.reject(error);
  }

  return Promise.reject(error);
}

const HttpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

HttpClient.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

HttpClient.interceptors.response.use(
  (response) => response,
  errorResponseHandler
);

export { HttpClient };
