import { createContext, useEffect, useState } from "react"
import type { AuthContextType } from "../types"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext<AuthContextType>(null!)

interface Props {
	children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const logIn = async () => {
		const provider = new GoogleAuthProvider()
		try {
			const result = await signInWithPopup(auth, provider)
			const credential = GoogleAuthProvider.credentialFromResult(result)
			const token = credential?.accessToken
			// verificar si el token es valido, buscandolo en la base de datos
			setIsAuthenticated(true)
		} catch (error) {
			console.log("error", error)
		}
	}

  const logOut = async () => {
    try {
      await auth.signOut()
      setIsAuthenticated(false)
    } catch (error) {
      console.log("error", error)
    }
  }

	const data = {
		logIn,
    logOut
	}

	useEffect(() => {
    
  }, [])
	return (
		<AuthContext.Provider value={data}>
			{isAuthenticated && children}
		</AuthContext.Provider>
	)
}

export { AuthProvider }
export default AuthContext
