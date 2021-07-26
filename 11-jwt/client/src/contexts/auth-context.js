import React from 'react'

export const authReducer = (state, payload) => {
  if (payload.type === 'auth.signin') {
    return {
      ...state,
      isAuthenticated: true,
      user: payload.user
    }
  } else if (payload.type === 'auth.signout') {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    }
  }
}
export const AuthContext = React.createContext({})
export const AuthProvider = ({children}) => {
  const [auth, dispatch] = React.useReducer(authReducer, { isAuthenticated: false })
  return (
    <AuthContext.Provider value={[auth, dispatch]}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => React.useContext(AuthContext)

