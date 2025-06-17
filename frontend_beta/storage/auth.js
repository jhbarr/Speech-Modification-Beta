import * as SecureStore from 'expo-secure-store'

/*
* saveTokens (async) -> This function saves both a specified refresh and access token to expo's secure storeage so that they can be accessed 
*   and used for API calls to the Django backend. This will utilize storage on the user's device. 
* 
* FIELDS
*   refresh (String) -> This is a JWT refresh token
*   access (String) -> This is a JWT access token
*/
export async function saveTokens({ refresh, access }) {
    // Put the two tokens into secure storage
    await SecureStore.setItemAsync('accessToken', access)
    await SecureStore.setItemAsync('refreshToken', refresh)

    // Decode JSON token and get expiration
    const payload = JSON.parse(atob(access.split('.')[1]));

    /*
    ADD LATER -- decode the JWT to access the user's payment status
    */

    await SecureStore.setItemAsync('accessExpiry', payload.exp.toString());
}



/*
* getAccessToken (async) -> This function retrieves the user's access token from the secure storage and returns it
* 
* FIELDS 
*   none
*/
export async function getAccessToken() {
    return await SecureStore.getItemAsync('accessToken')
}




/*
* getRefreshToken (async) -> This function accesses and returns the refresh token from secure storage 
* 
* FIELDS
*   none
*/
export async function getRefreshToken() {
    return await SecureStore.getItemAsync('refreshToken')
}



/*
* getAccessExpiry (async) -> This function returns the expiration time of the access token (if it exists)
* 
* FIELDS
*   none
*/
export async function getAccessExpiry() {
    const expiry = await SecureStore.getItemAsync('accessExpiry');
    return expiry ? parseInt(expiry, 10) : null;
}



/*
* clearTokens (async) -> This function clears all of the token data from storage. This should be used on logout.
* 
* FIELDS
*   none
*/
export async function clearTokens() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('accessExpiry');

    await SecureStore.deleteItemAsync('userEmail')

    // This clears the lessons from the content storage portion of the async storage
    await SecureStore.deleteItemAsync('freeLessons')
}

/*
* saveEmail (async) -> This function saves the user's email to frontend storage so that it can persist
*   even when global states may be lost
* 
* FIELDS 
*   email (String) -> The email of the user
*/
export async function saveEmail(email) {
    await SecureStore.setItem('userEmail', email)
}

/*
* getEmail (async) -> Get the user's email from persistent storage
* 
* FIELDS 
*   none
*/
export async function getEmail() {
    return await SecureStore.getItem('userEmail')
}