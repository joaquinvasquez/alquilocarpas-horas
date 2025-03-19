import {
	createContext,
	useEffect,
	useState,
	type ReactNode,
	type FC
} from "react"
import type { AuthContextType, User } from "../types"
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup
} from "firebase/auth"
import { auth } from "../firebase/config"
import { AppServices } from "../services/AppServices"
import EnrollUser from "../pages/EnrollUser"

const AuthContext = createContext<AuthContextType>(null!)

interface Props {
	children: ReactNode
}

const AuthProvider: FC<Props> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [authDeclined, setAuthDeclined] = useState(false)
	const [userToken, setUserToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const logIn = async () => {
		setIsLoading(true)
		const provider = new GoogleAuthProvider()
		try {
			const result = await signInWithPopup(auth, provider)
			const token = await result.user.getIdToken()
			const loginInfo = await AppServices.getUserPermission(
				result.user as User,
				token
			)
			if (loginInfo.admin) {
				setIsAdmin(true)
				setIsAuthenticated(true)
				setUserToken(token)
			} else if (loginInfo.allowed) {
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
			setIsAdmin(false)
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
				const loginInfo = await AppServices.getUserPermission(
					user as User,
					token
				)
				if (loginInfo.admin) {
					setIsAdmin(true)
					setIsAuthenticated(true)
					setUserToken(token)
				} else if (loginInfo.allowed) {
					setIsAuthenticated(true)
					setUserToken(token)
				} else {
					setIsAuthenticated(false)
					setUserToken(null)
				}
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
				isAdmin ? (
					children
				) : (
					<EnrollUser />
				)
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
