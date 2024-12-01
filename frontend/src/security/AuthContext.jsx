import { createContext, useState, useContext } from "react";
import apiClient from "../api/apiClient";
import { executeJwtAuthenticationService } from "../api/AuthenticationApiService";

//1: Create a Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

//2: Share the created context with other 
export default function AuthProvider({ children }) {

    //3: Put some state in the context
    const [isAuthenticated, setAuthenticated] = useState(false)
    
    const [username, setUsername] = useState('')

    const [name, setName] = useState('');

    const [token, setToken] = useState('');

    const [role, setRole] = useState('');
    
    async function login(username, password) {
        
        try{
            const response = await executeJwtAuthenticationService(username, password)
            if(response.status===200){
                const jwtToken = 'Bearer ' + response.data.jwtToken
                setAuthenticated(true)
                setUsername(username)
                setToken(jwtToken)
                setName(response.data.user.name)
                setRole(response.data.user.role)
                
                apiClient.interceptors.request.use(
                    (config) => {
                        console.log('intercepting and adding a token '+jwtToken)
                        config.headers.Authorization = jwtToken
                        return config
                    }
                )
                return true

                
            }
            
            else{
                logout()
                return false
            }
            
        }
        catch(error){
            logout()
            return false
        }
        
    }
                
    function logout(){
        setAuthenticated(false)
        setToken(null)
        setRole(null)

        apiClient.interceptors.request.use((config) => {
            config.headers.Authorization = null;
            return config;
        });
    }

    return (

        //object is created & passed (key-value pairs)
        <AuthContext.Provider value={ {isAuthenticated, login, logout, username, token, name, role} }>
            {children}
        </AuthContext.Provider>
    )
}