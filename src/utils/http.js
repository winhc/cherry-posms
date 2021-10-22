import store from '@/store'
import axios from 'axios'
import router from '@/router';
import { MessageBox } from 'element-ui';

const baseUrl = process.env.VUE_APP_SERVER;

/**
 * get request
 */
async function get(url) {
  const fullUrl = baseUrl + url
  console.log('http get: ', fullUrl)
  try {
    const response = await axios.get(fullUrl, getDefaultHeaderOption())
    return response
  } catch (error) {
    console.log('http get error: ', error.response)
    return checkErrorResponse(error.response)
  }
}

/**
 * post request
 */
async function post(url, data) {
  const fullUrl = baseUrl + url
  console.log('http post: ', fullUrl)
  // console.log('getDefaultHeaderOption => ', getDefaultHeaderOption())
  try {
    const response = await axios.post(fullUrl, data, getDefaultHeaderOption())
    return response
  } catch (error) {
    console.log('http post error: ', error.response)
    return checkErrorResponse(error.response)
  }
}

/**
 * put request
 */
async function put(url, data) {
  const fullUrl = baseUrl + url
  console.log('http put: ', fullUrl)
  try {
    const response = await axios.put(fullUrl, data, getDefaultHeaderOption())
    return response
  } catch (error) {
    console.log('http put error: ', error.response)
    return checkErrorResponse(error.response)
  }
}

/**
 * patch request
 */
async function patch(url, data) {
  const fullUrl = baseUrl + url
  console.log('http patch: ', fullUrl)
  try {
    const response = await axios.patch(fullUrl, data, getDefaultHeaderOption())
    return response
  } catch (error) {
    console.log('http patch error: ', error.response)
    return checkErrorResponse(error.response)
  }
}

/**
 * delete request
 */
async function _delete(url) {
  const fullUrl = baseUrl + url
  console.log('http delete: ', fullUrl)
  try {
    const response = await axios.delete(fullUrl, getDefaultHeaderOption())
    return response
  } catch (error) {
    console.log('http delete error: ', error.response)
    return checkErrorResponse(error.response)
  }
}

/**
 * default header option with auth
 * If don't define Content-Type, it can auto define suitable Content-Type in header
 * That's how crazy 🤩
 */
function getDefaultHeaderOption() {
  const accessToken = store.getters.token
  console.log('accessToken=>', accessToken)
  const headerOption = {
    headers: {
      'Authorization': accessToken
    }
  }
  return headerOption
}

/**
 * Content-Type with json header option
 * with auth
 */
function getJsonHeaderOption() {
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

/**
 * Content-Type with multipart/form-data header option
 * for form data process
 * with auth
 */
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

/**
 * check error response
 */
function checkErrorResponse(response) {
  if (response.status == 401) {
    MessageBox.alert(`Please, login again`, `${response.data.message ? response.data.message : response?.statusText} request`, {
      confirmButtonText: 'OK',
      showClose: false,
      callback: action => {
        logout();
      }
    });
    return null;
  } else {
    return response.data;
  }
}

async function logout() {
  await store.dispatch('user/logout')
  router.push(`/login`)
}

export { get, post, put, patch, _delete as delete }
