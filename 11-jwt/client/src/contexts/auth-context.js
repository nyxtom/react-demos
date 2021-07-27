import React from 'react'

export const useProfile = () => {
  const [data, setData] = React.useState({})
  const [err, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let didCancel = false
    
    setLoading(true)
    async function fetchData() {
      try {
        let res = await fetch('/me')
        let json = await res.json()
        if (!didCancel) {
          setLoading(false)
          setData(json)
        }
      } catch (err) {
        if (!didCancel) {
          setError(err.message)
        }
      }
    }

    fetchData()

    return () => didCancel = true
  }, [])

  return [data, err, loading]
}
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
  const [profile, err, loading] = useProfile()
  
  if (profile?.user && !auth.isAuthenticated) {
    dispatch({ type: 'auth.signin', user: { username: profile.user }})
  }

  return (
    <AuthContext.Provider value={[auth, dispatch, loading, err]}>
      { !loading ? children : null }
    </AuthContext.Provider>
  )
}
export const useAuth = () => React.useContext(AuthContext)

