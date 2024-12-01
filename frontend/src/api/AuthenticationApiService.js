import apiClient from './apiClient'

export const executeJwtAuthenticationService = (email,password) => apiClient.post(`/auth/login`,{email,password})

export const executeGetLoggedInUser = (token) => 
    apiClient.get(`/auth/loggedInUser`, {
        headers: {
            Authorization: `Bearer ${token}`, 
        },
    });

