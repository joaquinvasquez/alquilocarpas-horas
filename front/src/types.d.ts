export type KeyType = string
export type IdType = string

export type UserType = {
	id: IdType
	name: string
	key: KeyType
	daily_hours: number
	is_active: boolean
	last_reading: string
	minutes: number
	enabled: boolean
	initial_date: string
}

export interface AppContextType {
	users: UserType[]
	fetchUsers: () => Promise<void>
	user: UserType | null
	selectUser: (userId: string) => void
	lastKeyReaded: KeyType | null
	updateLastKeyReaded: () => Promise<void>
}

export interface AppServiceType {
	getAllUsers: (userToken: string | null) => Promise<UserType[]>
	createUser: (
		userData: Partial<UserType>,
		userToken: string | null
	) => Promise<UserType>
	updateUser: (
		userData: Partial<UserType>,
		userId: string,
		userToken: string | null
	) => Promise<UserType>
	deleteUser: (userId: string, userToken: string | null) => Promise<UserType>
	getLastKeyReaded: (userToken: string | null) => Promise<KeyType>
	getUserPermission: (user: User, userToken: string | null) => Promise<boolean>
}

export interface AuthContextType {
	logOut: () => void
	userToken: string | null | null
}
