import { createContext, useEffect, useState } from "react"
import type { AuthContextType } from "../types"
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup
} from "firebase/auth"
import { auth } from "../firebase/config"
import { AppService } from "../services/AppServices"

const AuthContext = createContext<AuthContextType>(null!)

interface Props {
	children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [authDeclined, setAuthDeclined] = useState(false)
	const [userToken, setUserToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const logIn = async () => {
		setIsLoading(true)
		const provider = new GoogleAuthProvider()
		try {
			const result = await signInWithPopup(auth, provider)
			const token = await result.user.getIdToken()
			const isAllowed = await AppService.getUserPermission(result.user, token)
			if (isAllowed) {
				setIsAuthenticated(true)
				setUserToken(token)
			} else setAuthDeclined(true)
			setIsLoading(false)
		} catch (error) {
			console.log("error", error)
		}
	}

	const logOut = async () => {
		try {
			await auth.signOut()
			setIsAuthenticated(false)
			setUserToken(null)
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken()
				const isAllowed = await AppService.getUserPermission(user, token)
				if (isAllowed) {
					setIsAuthenticated(true)
					setUserToken(token)
				} else setAuthDeclined(true)
			}
		})
		setIsLoading(false)
	}, [])

	const data = {
		logOut,
		userToken
	}

	return (
		<AuthContext.Provider value={data}>
			{isAuthenticated ? (
				children
			) : (
				<div className='login'>
					{isLoading ? (
						<div className='loading' />
					) : (
						<>
							<button onClick={logIn} type='button'>
								Iniciar sesión
							</button>
							{authDeclined && <p>Acceso denegado</p>}
						</>
					)}
				</div>
			)}
		</AuthContext.Provider>
	)
}

export { AuthProvider }
export default AuthContext
