import Vue from 'vue';
const axios = require('axios');
import qs from 'qs';



export default function ({
  app,
  store,
  route,
  redirect,
  req
}, inject) {

  const $http = axios.create({
    baseURL: process.server ? app.$config.server.api : app.$config.client.api,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    transformRequest: [function (data, headers) {
      return qs.stringify(data);
    }]
  });

  $http.interceptors.request.use(function (config) {
    // Do something before request is sent
   
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


  $http.interceptors.response.use(function (response) {
    // process.server && console.log(`[${response.status}] ${response.request.path}`,response.data);
      return response;
  }, function (err) {
    // Do something with response error
    // console.log(`[${err.response && err.response.status}] ${err.response && err.response.request.path}`);
    // console.log(err.response && err.response.data);
    return Promise.reject(err);
  });

  inject('axios', $http)
}
