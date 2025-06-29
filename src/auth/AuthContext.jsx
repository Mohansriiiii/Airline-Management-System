import { createContext, useEffect,useReducer } from 'react';

export const AuthContext = createContext();
export const authReducer = (state,action) => {
    switch(action.type){
        case 'signup' :
            return{
                user: action.payload ,
                isAuthenticated: false,
            }
        case 'login':
            return{
                user: action.payload ,
                isAuthenticated: true,
            }   
        case 'logout':
            return{
                user: null,
                isAuthenticated: false,
            }
        default :
            return state    
    }
}

export const AuthContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(authReducer,{
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
    });

    console.log("AuthContext Initial State (from localStorage):", state.user);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
        console.log("AuthContext useEffect (on mount) - storedUser:", storedUser);
        if(storedUser && isAuthenticated){
            dispatch({type: 'login', payload: storedUser});
        }
    },[]);

    useEffect(() => {
        console.log("AuthContext useEffect (on state change) - state.user before saving:", state.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        console.log("AuthContext useEffect (on state change) - saved to localStorage:", localStorage.getItem("user"));
    },[state.user, state.isAuthenticated]);

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     if(user){
    //         dispatch({type:'login', payload: user});
    //     }
    // },[]);

    console.log("AuthContext Current State (render):", state);

    return (
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}