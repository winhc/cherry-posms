import axios from 'axios'
// import store from '@/store'
// import Vue from 'vue'
// import router from '@/router';

const baseUrl = 'http://192.168.0.115:4000'
const headerOption = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Auth token'
  }
}

export async function post(url, data) {
  const fullUrl = baseUrl + url
  try {
    const response = await axios.post(fullUrl, data, headerOption);
    return response;
  } catch (error) {
    console.log('http post error: ', error.response);
    return error.response;
  }
}
