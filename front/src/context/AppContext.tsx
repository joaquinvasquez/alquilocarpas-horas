import {
	type ReactNode,
	type FC,
	createContext,
	useContext,
	useEffect,
	useState
} from "react"
import type {
	KeyType,
	AppContextType,
	UserType,
	UserMovementsType
} from "../types"
import { AppServices } from "../services/AppServices"
import AuthContext from "./AuthContext"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import EnrollUser from "../pages/EnrollUser"
import { formatDate } from "../utils/formatDates"

const AppContext = createContext<AppContextType>(null!)

interface Props {
	children: ReactNode
}

const AppProvider: FC<Props> = ({ children }) => {
	const [users, setUsers] = useState<UserType[]>([])
	const [user, setUser] = useState<UserType | null>(null)
	const [userMovements, setUserMovements] = useState<
		Record<string, UserMovementsType[]>
	>({})

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
		if (user !== null) {
			const qMovements = query(
				collection(db, "movements"),
				where("user_id", "==", user?.id)
			)
			onSnapshot(qMovements, (querySnapshot) => {
				const groupedMovements: Record<string, UserMovementsType[]> = {}

				for (const doc of querySnapshot.docs) {
					const movementDate = formatDate(doc.data().date.toDate()) // Formatear la fecha
					const movement = {
						userId: doc.data().user_id,
						type:
							doc.data().movement === "hello"
								? "Entrada"
								: doc.data().movement === "bye"
									? "Salida"
									: doc.data().movement === "bye - auto"
										? "Salida automática - no fichó"
										: "Desconocido",
						date: doc.data().date.toDate()
					}

					// Si la fecha no está en el objeto, la creamos
					if (!groupedMovements[movementDate]) {
						groupedMovements[movementDate] = []
					}
					groupedMovements[movementDate].push(movement)
				}

				// Ordenar movimientos en cada fecha
				const sortedMovements = Object.entries(groupedMovements).reduce(
					(acc, [date, movements]) => {
						acc[date] = movements.sort(
							(a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
						)
						return acc
					},
					{} as Record<string, UserMovementsType[]>
				)
				setUserMovements(sortedMovements)
			})
		}
	}, [user])

	useEffect(() => {
		if (!isAdmin && userEmail) {
			setUser(users.find((user) => user.email === userEmail) || null)
		}
	}, [users, userEmail])

	const data = {
		users,
		user,
		userMovements,
		selectUser,
		lastKeyReaded,
		readKey
	}

	return (
		<AppContext.Provider value={data}>
			{isAdmin ? children : <EnrollUser />}
		</AppContext.Provider>
	)
}

export { AppProvider }
export default AppContext
