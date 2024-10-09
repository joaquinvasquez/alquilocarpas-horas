import { createContext, useContext, useEffect, useState } from "react"
import type { KeyType, AppContextType, UserType } from "../types"
import { AppService } from "../services/AppServices"
import AuthContext from "./AuthContext"

const AppContext = createContext<AppContextType>(null!)

interface Props {
	children: React.ReactNode
}

const AppProvider: React.FC<Props> = ({ children }) => {
	const [users, setUsers] = useState<UserType[]>([])
	const [user, setUser] = useState<UserType | null>(null)
	const [lastKeyReaded, setLastKeyReaded] = useState<KeyType | null>(null)
	const { userToken } = useContext(AuthContext)

	const updateLastKeyReaded = async () => {
		const key: KeyType = await AppService.getLastKeyReaded(userToken)
		setLastKeyReaded(key)
	}

	const selectUser = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId)
		if (selectedUser) setUser(selectedUser)
		else setUser(null)
	}

	const fetchUsers = async () => {
		const users = await AppService.getAllUsers(userToken)
		setUsers(users)
	}

	const data = {
		users,
		fetchUsers,
		user,
		selectUser,
		lastKeyReaded,
		updateLastKeyReaded
	}

	useEffect(() => {
		fetchUsers()
		updateLastKeyReaded()
	}, [])
	return <AppContext.Provider value={data}>{children}</AppContext.Provider>
}

export { AppProvider }
export default AppContext
