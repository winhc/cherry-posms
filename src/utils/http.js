import store from '@/store'
import axios from 'axios'

const baseUrl = 'http://localhost:4000'
// const headerOption = {
//   headers: {
//     'Content-Type': 'application/json; charset=UTF-8',
//     'Authorization': 'Auth token'
//   }
// }

async function get(url) {
  const fullUrl = baseUrl + url
  try {
    const response = await axios.get(fullUrl, getHeaderOption())
    return response
  } catch (error) {
    console.log('http get error: ', error.response)
    return error.response
  }
}

async function post(url, data) {
  const fullUrl = baseUrl + url
  console.log('getHeaderoption => ', getHeaderOption())
  try {
    const response = await axios.post(fullUrl, data, getHeaderOption())
    return response
  } catch (error) {
    console.log('http post error: ', error.response)
    return error.response
  }
}

async function postFormData(url, data) {
  const fullUrl = baseUrl + url
  console.log('getMultiPartHeaderOption => ', getMultiPartHeaderOption())
  try {
    const response = await axios.post(fullUrl, data, getMultiPartHeaderOption())
    return response
  } catch (error) {
    console.log('http post error: ', error.response)
    return error.response
  }
}

async function put(url, data) {
  const fullUrl = baseUrl + url
  try {
    const response = await axios.put(fullUrl, data, getHeaderOption())
    return response
  } catch (error) {
    console.log('http put error: ', error.response)
    return error.response
  }
}

async function patch(url, data) {
  const fullUrl = baseUrl + url
  try {
    const response = await axios.patch(fullUrl, data, getHeaderOption())
    return response
  } catch (error) {
    console.log('http patch error: ', error.response)
    return error.response
  }
}

async function _delete(url) {
  const fullUrl = baseUrl + url
  try {
    const response = await axios.delete(fullUrl, getHeaderOption())
    return response
  } catch (error) {
    console.log('http delete error: ', error.response)
    return error.response
  }
}

function getHeaderOption() {
  const accessToken = store.getters.token
  console.log('accessToken=>', accessToken)
  const headerOption = {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': accessToken
    }
  }
  return headerOption
}

function getMultiPartHeaderOption() {
  const accessToken = store.getters.token
  console.log('accessToken=>', accessToken)
  const headerOption = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': accessToken
    }
  }
  return headerOption
}

export { get, post, put, patch, _delete as delete, postFormData }
