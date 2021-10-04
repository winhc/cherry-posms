/**
 * return error response mesage
 */
function getErrorMessage(response) {
    // console.log('response', response);
    let errorMessage = '';
    errorMessage += 'Fail: ' + response?.error;
    if (response?.message) {
        errorMessage += ', Message: ' + response.message;
    }
    return errorMessage;
}

export {getErrorMessage}