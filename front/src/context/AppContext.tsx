import {
	type ReactNode,
	type FC,
	createContext,
	useContext,
	useEffect,
	useState
} from "react"
import type { KeyType, AppContextType, UserType } from "../types"
import { AppServices } from "../services/AppServices"
import AuthContext from "./AuthContext"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import EnrollUser from "../pages/EnrollUser"

const AppContext = createContext<AppContextType>(null!)

interface Props {
	children: ReactNode
}

const AppProvider: FC<Props> = ({ children }) => {
	const [users, setUsers] = useState<UserType[]>([])
	const [user, setUser] = useState<UserType | null>(null)
	const [lastKeyReaded, setLastKeyReaded] = useState<KeyType | null>(null)
	const { isAdmin, userEmail, userToken } = useContext(AuthContext)

	const selectUser = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId)
		if (selectedUser) setUser(selectedUser)
		else setUser(null)
	}

	const readKey = async () => {
		if (user) {
			await AppServices.readKey(user.key, userToken)
		}
	}

	const data = {
		users,
		user,
		selectUser,
		lastKeyReaded,
		readKey
	}

	useEffect(() => {
		const q = query(collection(db, "users"), where("enabled", "==", true))
		onSnapshot(q, (querySnapshot) => {
			const users: UserType[] = []
			for (const doc of querySnapshot.docs) {
				users.push({
					id: doc.id,
					...doc.data(),
					initial_date: doc.data().initial_date.toDate(),
					last_reading: doc.data().last_reading.toDate()
				} as UserType)
			}
			setUsers(users)
		})

		isAdmin &&
			onSnapshot(doc(db, "last-readed", "last-readed"), (doc) => {
				setLastKeyReaded(doc.data()?.last_read as KeyType)
			})
	}, [])

	useEffect(() => {
		if (!isAdmin && userEmail) {
			setUser(users.find((user) => user.email === userEmail) || null)
		}
	}, [users, userEmail])

	return (
		<AppContext.Provider value={data}>
			{isAdmin ? children : <EnrollUser />}
		</AppContext.Provider>
	)
}

export { AppProvider }
export default AppContext
