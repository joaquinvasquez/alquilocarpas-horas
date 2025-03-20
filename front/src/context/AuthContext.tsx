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

const AuthContext = createContext<AuthContextType>(null!)

interface Props {
	children: ReactNode
}

const AuthProvider: FC<Props> = ({ children }) => {
	const [userEmail, setUserEmail] = useState<string | null>(null)
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
			const email = result.user.email
			const loginInfo = await AppServices.getUserPermission(
				result.user as User,
				token
			)
			if (loginInfo.admin) {
				setIsAdmin(true)
				setUserEmail(email)
				setUserToken(token)
			} else if (loginInfo.allowed) {
				setUserEmail(email)
				setUserToken(token)
			} else setAuthDeclined(true)
			setIsLoading(false)
		} catch (error) {
			console.log("error", error)
		}
	}

	const logOut = async () => {
		try {
			setUserEmail(null)
			setIsAdmin(false)
			setUserToken(null)
			await auth.signOut()
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken()
				const email = user.email
				const loginInfo = await AppServices.getUserPermission(
					user as User,
					token
				)
				if (loginInfo.admin) {
					setIsAdmin(true)
					setUserEmail(email)
					setUserToken(token)
				} else if (loginInfo.allowed) {
					setUserEmail(email)
					setUserToken(token)
				} else {
					setUserEmail(null)
					setUserToken(null)
				}
			}
		})
		setIsLoading(false)

	}, [])

	const data = {
		logOut,
		isAdmin,
		userEmail,
		userToken
	}

	return (
		<AuthContext.Provider value={data}>
			{userEmail !== null ? (
				children
			) : (
				<div className='login'>
					{isLoading ? (
						<div className='loading' />
					) : (
						<>
							<button onClick={logIn}>
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
