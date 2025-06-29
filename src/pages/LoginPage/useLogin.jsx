import { useState } from "react"
import {useAuthContext} from "../../auth/useAuthContext"
import { useNavigate } from "react-router-dom"
import { ProfileContext } from "../../Helper/ProfileContext"
import { useContext } from "react"

export const useLogin = () => {
    const [error,setError] = useState(null)
    const navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const { setProfile } = useContext(ProfileContext)

    const login = async (user) => {
        setError(null)
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/user/signin`,{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify(user)
              })
            const text = await response.text()
            const userResponse = text ? JSON.parse(text) : {}
    
            if(response.ok && userResponse.status != "FAILED"){
                console.log(userResponse)
                dispatch({type:"login", payload:userResponse.data[0]})
                setProfile(prevProfile => ({
                    ...prevProfile,
                    fullName: userResponse.data[0].name,
                    email: userResponse.data[0].email
                }));
                navigate("/",{replace:true})
                alert(`${userResponse.message}`)
            }else{
                setError(userResponse.message || "Login Failed")
                alert(`${userResponse.message || "Login Failed"}`)
            }
        } catch (error) {
            console.error("Login error:", error)
            setError("An error occurred during login. Please try again.")
            alert("An error occured during login. Please try again")
        }
    }
    return {login,error}
}