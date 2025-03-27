import {
	createContext,
	useEffect,
	useState,
	type ReactNode,
	type FC
} from "react"
import type { AuthContextType, AuthStatus, User } from "../types"
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	type User as FirebaseUser
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
	const [authStatus, setAuthStatus] = useState<AuthStatus>({
		declined: false,
		message: ""
	})
	const [userToken, setUserToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const logIn = async () => {
		setIsLoading(true)
		const provider = new GoogleAuthProvider()
		try {
			const result = await signInWithPopup(auth, provider)
			logInProcess(result.user)
			setIsLoading(false)
		} catch (error) {
			console.log("error", error)
		}
	}

	const logInProcess = async (user: FirebaseUser) => {
		const token = await user.getIdToken()
		const email = user.email
		const loginInfo = await AppServices.getUserPermission(user as User, token)
		if (loginInfo.admin) {
			setIsAdmin(true)
			setUserEmail(email)
			setUserToken(token)
		} else if (loginInfo.allowed) {
			if (await ubicationIsAllowed()) {
				setUserEmail(email)
				setUserToken(token)
			} else
				setAuthStatus({ declined: true, message: "Ubicación no permitida" })
		} else {
			logOut()
			setAuthStatus({ declined: true, message: "Acceso denegado" })
		}
	}

	const ubicationIsAllowed = async () => {
		try {
			const position: GeolocationPosition = await new Promise(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, {
						enableHighAccuracy: true
					})
				}
			)

			const { latitude, longitude } = position.coords
			const distance = getDistanceFromUbicationInKm(latitude, longitude)
			return distance <= 0.5
		} catch (error) {
			console.error("Error obteniendo ubicación:", error)
			return false
		}
	}

	const getDistanceFromUbicationInKm = (lat1: number, lon1: number) => {
		const lat2 = import.meta.env.VITE_LATITUDE as number
		const lon2 = import.meta.env.VITE_LONGITUDE as number
		const rWorld = 6371
		const dLat = (lat2 - lat1) * (Math.PI / 180)
		const dLon = (lon2 - lon1) * (Math.PI / 180)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2)

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return Math.round(rWorld * c * 100) / 100
	}

	const logOut = async () => {
		try {
			setUserEmail(null)
			setUserToken(null)
			setIsAdmin(false)
			await auth.signOut()
		} catch (error) {
			console.log("error", error)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				logInProcess(user)
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
							<button onClick={logIn}>Iniciar sesión</button>
							{authStatus.declined && <p>{authStatus.message}</p>}
						</>
					)}
				</div>
			)}
		</AuthContext.Provider>
	)
}

export { AuthProvider }
export default AuthContext
