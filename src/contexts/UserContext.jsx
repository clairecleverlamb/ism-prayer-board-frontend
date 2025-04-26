import { createContext, useState } from 'react';

const UserContext = createContext();

const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if(!token) return null; 
    // user is probably logged out or they never signed up
    return JSON.parse(atob(token.split('.')[1])).payload;
}

function UserProvider({ children }) {
    const [user, setUser] = useState(getUserFromToken());
    const value = { user, setUser };
    
    return (
        <UserContext.Provider value={value}>
            { children }
        </UserContext.Provider>
    );
}

export { UserProvider, UserContext };