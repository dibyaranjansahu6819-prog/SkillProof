import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAccessToken,
  getCurrentUser,
  logoutUser,
} from "../services/authService";


const AuthContext = createContext(null);


/*
|--------------------------------------------------------------------------
| Auth Provider
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);


  const [
    user,
    setUser,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    authError,
    setAuthError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Restore existing session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let mounted = true;


    const loadUser = async () => {

      setLoading(true);
      setAuthError("");


      const token =
        getAccessToken();


      /*
       * No access token means
       * the user is logged out.
       */

      if (!token) {

        if (!mounted) {
          return;
        }


        setUser(null);

        setIsAuthenticated(false);

        setLoading(false);

        return;

      }


      try {

        const userData =
          await getCurrentUser();


        if (!mounted) {
          return;
        }


        setUser(userData);

        setIsAuthenticated(true);

      } catch (error) {

        console.error(
          "Unable to restore authentication session:",
          error
        );


        if (!mounted) {
          return;
        }


        /*
         * Session is no longer valid.
         */

        logoutUser();


        setUser(null);

        setIsAuthenticated(false);


        setAuthError(
          "Your session has expired. Please log in again."
        );

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };


    loadUser();


    return () => {

      mounted = false;

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = (userData) => {

    setAuthError("");

    setUser(userData);

    setIsAuthenticated(true);

  };


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = () => {

    logoutUser();


    setUser(null);

    setIsAuthenticated(false);

    setAuthError("");

  };


  /*
  |--------------------------------------------------------------------------
  | Context Provider
  |--------------------------------------------------------------------------
  */

  return (

    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        authError,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


/*
|--------------------------------------------------------------------------
| useAuth Hook
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Login.jsx and the recruiter/student pages use:
|
| import { useAuth } from "../context/AuthContext";
|
| Therefore this MUST be a named export.
|
|--------------------------------------------------------------------------
*/

export function useAuth() {

  return useContext(
    AuthContext
  );

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
|
| Keeping this export also makes the context available as a
| default export if another file needs it later.
|
|--------------------------------------------------------------------------
*/

export default AuthContext;