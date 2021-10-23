/**
 * return error response mesage
 */
function getErrorMessage(response) {
    console.log('getErrorMessage response', response);
    let errorMessage = '';
    if(response?.error){
        errorMessage += 'Fail: ' + response.error + ',';
    }
    if (response?.message) {
        errorMessage += ' Message: ' + response.message;
    }
    return errorMessage;
}

export {getErrorMessage}