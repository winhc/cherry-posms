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
    const response = await axios.post(fullUrl, data, headerOption)
    return returnResponse(response)
  } catch (error) {
    console.log('http post error: ', error.response)
    return returnResponse(error.response)
  }
}

function returnResponse(response) {
  console.log('http response => ', response)
  switch (response.status) {
    case 200:
      return response
    case 201:
      return response
    case 401:
      return response
  }
}
