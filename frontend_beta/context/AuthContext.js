import { createContext, useEffect, useState } from 'react';
import { getAccessToken, getAccessExpiry, getRefreshToken, saveTokens, clearTokens } from '../storage/auth';
import { Alert, AppState } from 'react-native';
import api from '../utils/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    // Tells the app whether authentication credentials are actively being retrieved and checked
    const [authLoading, setAuthLoading] = useState(true)
    // Boolean value used to handle inner app control flow
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    /*
    * login (async) -> This function will utilize specified email and password parameters to attempt to retrieve access and refresh
    *   tokens from the backend. Depending on if these are returned, the tokens should then be saved to the secure storage on the frontend
    * 
    * FIELDS
    *   email (String) -> The provided email of the user attempting to login
    *   password (String) -> The password of the user logging in
    * 
    * ADDITIONAL
    * This function should handle the cases where the email or password do not match any entries in the backend database. 
    */
    const login = async ( email, password ) => {
        // Check if the email and password fields were both input in valid formats
        if (email != null && password != null) {
            try {
                // Clarify that the frontend and backend are attempting to communicate
                setAuthLoading(true)
                
                // Post the email and password to the backend and wait for a token response
                const res = await api.post('auth/login/', { email, password })
                await saveTokens({refresh: res.data.refresh, access: res.data.access})
                
                // If the retrieval was successful, set the user's authentication state to true
                setIsAuthenticated(true)
                setAuthLoading(false)
            } 
            catch (error) {
                // Give an alert to the user
                Alert.alert("Incorrect Username or Password", error)
                setIsAuthenticated(false)
                setAuthLoading(false)
            }
        }
        // Tell the user to correctly put in their email and password
        else {
            Alert.alert("Please enter both you email and password")
        }
    }




    /*
    * register (async) -> This is used to create a new user profile. For the moment, the customer will be considered not paying. 
    * 
    * FIELDS
    *   email (String) -> The provided email of the user attempting to login
    *   password (String) -> The password of the user logging in 
    */
   const register = async ( email, password ) => {
        // Check if the email and password fields were both input in valid formats
        if (email != null && password != null) {
            try {
                // Register the user with the backend database
                const res = await api.post('auth/register/', {email, password})
                // Automatically log them in with the new credentials
                login(email, password)
            }
            catch (error) {
                // Give an error message as to why the registration process didn't work
                Alert.alert("Username already exists", error)
                setAuthLoading(false)
                setIsAuthenticated(false)
            }
        }
        // Tell the user to correctly put in their email and password
        else {
            Alert.alert("Please enter both you email and password")
        }
   }

   /*
   * logout (async) -> This function logs the user out of their application account and clears their tokens within frontend storage
   * 
   * FIELDS
   *    none
   */
    const logout = async () => {
        setAuthLoading(true)

        await clearTokens()
        setIsAuthenticated(false)
        setAuthLoading(false)
    }



    /*
    * checkAndRefreshToken (async) -> This function checks the expiration time of the current access token (if it exists)
    *   It additionally refreshes the access token using the refresh token stored in secure storage (if that exists as well)
    *   if the access token has indeed expired
    * 
    * FIELDS
    *   none
    * 
    * ADDITIONAL
    * This function should run on each initial loading of the app and when the app has been stale for a while and it reactivated 
    * by the user. However, it should not run when the user has not ever logged in or registered before. 
    */
    const checkAndRefreshAccessToken = async () => {
        const expiry = await getAccessExpiry();
        const now = Math.floor(Date.now() / 1000);

        // If the expiration time exists in secure storage (indicating the existence of tokens)
        // and it is about to expire, request a new access token from the backend
        if (expiry && now >= expiry - 30) {
            try {
                const refresh = await getRefreshToken()
                const res = await api.request('refresh/', { refresh })

                await saveTokens({ access: res.data.access, refresh })
                setIsAuthenticated(true)
            }
            catch (error) {
                console.log("Error refreshing access token automatically")
                await clearTokens()
                setIsAuthenticated(false)
            }
        }
        // If the expiration time exists and the access token is not going to expire, then simply try to get the access
        // token from storage and set the isAuthenticated to true if the access token exists
        else if (expiry) {
            const accessToken = await getAccessToken()
            if (accessToken) {
                setIsAuthenticated(true)
            }
            else {
                console.log("Error getting access token from secure storage automatically")
                setIsAuthenticated(false)
            }
        }

        // This is so that the user doesn't see an infinite pinwheel when they first login
        setAuthLoading(false)
    
    }


    // This useEffect will automatically check the access token of the user and refresh it if it sees fit 
    // Both when the user first loads the app and when the user opens the app after a time of inactivity
    useEffect(() => {
        checkAndRefreshAccessToken(); // initial run

        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
            checkAndRefreshAccessToken(); // run again on app resume
            }
        });

        return () => subscription.remove();
    }, [])



    // Export all of the functions and necessary variables from this context so that the children nodes can utilize them
    return (
        <AuthContext.Provider value={{ isAuthenticated, authLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}
