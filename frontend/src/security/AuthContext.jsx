import { createContext, useState, useContext, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';
import apiClient from "../api/apiClient";
import { executeJwtAuthenticationService } from "../api/AuthenticationApiService";
import { toast } from "react-toastify";

//1: Create a Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

//2: Share the created context with other 
export default function AuthProvider({ children }) {

    //3: Put some state in the context
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem("token"))
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("DP") ? `data:image/jpeg;base64,${localStorage.getItem("DP")}` : null);

    apiClient.interceptors.request.use(
        (config) => {
            const jwtToken = localStorage.getItem("token");
            if (jwtToken) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const scheduleAutoLogout = (jwtToken) => {
        if (!jwtToken) return;

        const { exp } = jwtDecode(jwtToken);
        const currentTime = Date.now() / 1000;
        const timeToExpire = (exp - currentTime) * 1000;

        if (timeToExpire > 0) {
            setTimeout(() => {
                toast.info("Session expired. Logging out...");
                logout();
            }, timeToExpire);
        } else {
            logout();
        }
    };

    useEffect(() => {
        if (token) {
            scheduleAutoLogout(token);
        }
    }, [token]);

    const saveAuthData = (token, userDetails) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userDetails));
        setToken(token);
        setUser(userDetails);
    };

    async function login(username, password) {

        try {
            const response = await executeJwtAuthenticationService(username, password)
            if (response.status === 200) {
                toast.success("Login Successful!")
                saveAuthData(response.data.jwtToken, response.data.user);
                setAuthenticated(true)
                apiClient.get(`/users/${response.data.user.username}/dp`)
                    .then(response => {
                        setProfilePicture(`data:image/jpeg;base64,${response.data}`);
                        localStorage.setItem("DP", response.data);
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 404) {
                            setProfilePicture(null);
                        } else {
                            setProfilePicture(null);
                            console.log(error.response ? error.response.data : error.message);
                        }
                    });
            }
        }
        catch (error) {
            toast.error(error.response?.data || "Server Error")
            setError(error.response?.data || "Server Error");
        }

    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("DP");
        setToken(null);
        setUser(null);
        setAuthenticated(false);
        setProfilePicture(null);

        apiClient.interceptors.request.use((config) => {
            config.headers.Authorization = null;
            return config;
        });
    }

    const {
        username,
        role,
        onboarded,
        firstName,
        lastName,
        department,
        designation,
        id: userId,
    } = user || {};

    const newUser = !onboarded;

    const authContextValue = {
        isAuthenticated,
        login,
        logout,
        username,
        token,
        role,
        profilePicture,
        newUser,
        firstName,
        lastName,
        department,
        designation,
        userId,
    };

    return (

        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
}