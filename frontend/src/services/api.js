import axios from "axios";


/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


/*
|--------------------------------------------------------------------------
| Main API Client
|--------------------------------------------------------------------------
*/

const api = axios.create({

  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,

});


/*
|--------------------------------------------------------------------------
| Separate client for token refresh
|--------------------------------------------------------------------------
|
| We use a separate axios instance so that a failed
| refresh request does not trigger the refresh interceptor
| again.
|
*/

const refreshClient = axios.create({

  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,

});


/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Automatically attach the access token to every request.
|
*/

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );


    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


/*
|--------------------------------------------------------------------------
| Token Refresh State
|--------------------------------------------------------------------------
*/

let isRefreshing = false;

let refreshSubscribers = [];


/*
|--------------------------------------------------------------------------
| Notify waiting requests
|--------------------------------------------------------------------------
*/

const notifyRefreshSubscribers = (
  token
) => {

  refreshSubscribers.forEach(
    (callback) => {

      callback(
        token,
        null
      );

    }
  );

  refreshSubscribers = [];

};


/*
|--------------------------------------------------------------------------
| Reject waiting requests
|--------------------------------------------------------------------------
*/

const rejectRefreshSubscribers = (
  error
) => {

  refreshSubscribers.forEach(
    (callback) => {

      callback(
        null,
        error
      );

    }
  );

  refreshSubscribers = [];

};


/*
|--------------------------------------------------------------------------
| Subscribe request to token refresh
|--------------------------------------------------------------------------
*/

const subscribeToTokenRefresh = (
  callback
) => {

  refreshSubscribers.push(
    callback
  );

};


/*
|--------------------------------------------------------------------------
| Clear authentication tokens
|--------------------------------------------------------------------------
*/

const clearAuthTokens = () => {

  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "refresh_token"
  );

};


/*
|--------------------------------------------------------------------------
| Refresh Access Token
|--------------------------------------------------------------------------
*/

const refreshAccessToken = async () => {

  const refreshToken =
    localStorage.getItem(
      "refresh_token"
    );


  if (!refreshToken) {

    throw new Error(
      "Refresh token is missing."
    );

  }


  const response =
    await refreshClient.post(

      "/token/refresh/",

      {
        refresh: refreshToken,
      }

    );


  const newAccessToken =
    response.data?.access;


  if (!newAccessToken) {

    throw new Error(
      "No access token returned by refresh endpoint."
    );

  }


  /*
   * Save new access token.
   */

  localStorage.setItem(
    "access_token",
    newAccessToken
  );


  /*
   * If the backend rotates the
   * refresh token, save the new one.
   */

  const newRefreshToken =
    response.data?.refresh;


  if (newRefreshToken) {

    localStorage.setItem(
      "refresh_token",
      newRefreshToken
    );

  }


  return newAccessToken;

};


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| Handles expired access tokens.
|
| Flow:
|
| Request
|    ↓
| 401
|    ↓
| Refresh token
|    ↓
| New access token
|    ↓
| Retry original request
|
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

  (response) => {

    return response;

  },

  async (error) => {

    const originalRequest =
      error.config;


    /*
     * If there is no request configuration,
     * simply return the error.
     */

    if (!originalRequest) {

      return Promise.reject(
        error
      );

    }


    /*
     * Only handle 401 errors.
     *
     * 400 / 403 / 404 / 500 etc.
     * should go directly to the
     * calling component.
     */

    if (
      error.response?.status !== 401
    ) {

      return Promise.reject(
        error
      );

    }


    /*
     * Never refresh when the failed
     * request itself is the refresh request.
     */

    if (
      originalRequest.url?.includes(
        "/token/refresh/"
      )
    ) {

      clearAuthTokens();

      return Promise.reject(
        error
      );

    }


    /*
     * Prevent infinite retry loops.
     */

    if (
      originalRequest._retry
    ) {

      clearAuthTokens();

      return Promise.reject(
        error
      );

    }


    originalRequest._retry = true;


    /*
     * If another request is already
     * refreshing the token, wait for it.
     */

    if (isRefreshing) {

      return new Promise(
        (
          resolve,
          reject
        ) => {

          subscribeToTokenRefresh(
            (
              token,
              refreshError
            ) => {

              if (
                refreshError ||
                !token
              ) {

                reject(
                  refreshError ||
                  error
                );

                return;

              }


              originalRequest.headers =
                originalRequest.headers ||
                {};


              originalRequest.headers.Authorization =
                `Bearer ${token}`;


              resolve(
                api(
                  originalRequest
                )
              );

            }
          );

        }
      );

    }


    /*
     * Start token refresh.
     */

    isRefreshing = true;


    try {

      const newAccessToken =
        await refreshAccessToken();


      /*
       * Tell all waiting requests
       * that refresh succeeded.
       */

      notifyRefreshSubscribers(
        newAccessToken
      );


      /*
       * Attach the new token to
       * the original request.
       */

      originalRequest.headers =
        originalRequest.headers ||
        {};


      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;


      /*
       * Retry original request.
       */

      return api(
        originalRequest
      );

    } catch (refreshError) {

      /*
       * Tell queued requests that
       * refresh failed.
       */

      rejectRefreshSubscribers(
        refreshError
      );


      /*
       * Remove invalid authentication
       * credentials.
       */

      clearAuthTokens();


      return Promise.reject(
        refreshError
      );

    } finally {

      isRefreshing = false;

    }

  }

);


/*
|--------------------------------------------------------------------------
| Export API Client
|--------------------------------------------------------------------------
*/

export default api;