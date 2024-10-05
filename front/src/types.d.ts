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
	getAllUsers: () => Promise<UserType[]>
	getUser: (userId: string) => Promise<UserType>
	createUser: (userData: Partial<UserType>) => Promise<UserType>
	updateUser: (userData: Partial<UserType>, userId: string) => Promise<UserType>
	deleteUser: (userId: string) => Promise<UserType>
	getLastKeyReaded: () => Promise<KeyType>
}

export interface AuthContextType {
	logIn: () => void
	logOut: () => void
}
