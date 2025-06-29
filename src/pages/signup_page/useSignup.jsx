import { useState } from "react";
import {useAuthContext} from "../../auth/useAuthContext"

export const useSignup = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
                   
    const signup = async (user) => {
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/user/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        
        const text = await response.text();
        const result = text ? JSON.parse(text) : {};
        
        console.log(result);

        if (!response.ok || result.status === "FAILED") {
          setError(result.error || 'An error occurred during signup');
          alert(`${result.message}`)
          return false;
        } else {
          localStorage.setItem("user", JSON.stringify(result));
          dispatch({ type: 'signup', payload: result });
          alert(`${result.message}`);
          // window.location.reload();
          return true;
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
        return false;
      }
    };
  
    return { signup, error };
  };
  
