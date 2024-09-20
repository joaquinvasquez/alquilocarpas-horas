import { createContext, useEffect, useState } from "react"
import type { KeyType, AppContextType, UserType } from "../types"
import { AppService } from "../services/AppServices"

const AppContext = createContext<AppContextType>(null!)

interface Props {
	children: React.ReactNode
}

const AppProvider: React.FC<Props> = ({ children }) => {
	const [users, setUsers] = useState<UserType[]>([])
	const [user, setUser] = useState<UserType | null>(null)
	const [lastKeyReaded, setLastKeyReaded] = useState<KeyType | null>(null)

	const updateLastKeyReaded = async () => {
		const key: KeyType = await AppService.getLastKeyReaded()
		setLastKeyReaded(key)
	}

	const SelectUser = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId)
		if (selectedUser) setUser(selectedUser)
	}

	const data = {
		users,
		user,
		SelectUser,
		lastKeyReaded,
		updateLastKeyReaded
	}

	useEffect(() => {
		AppService.getAllUsers().then(setUsers)
		updateLastKeyReaded()
	}, [])
	useEffect(() => {
		setUser(users[0])
	}, [users])
	return <AppContext.Provider value={data}>{children}</AppContext.Provider>
}

export { AppProvider }
export default AppContext
