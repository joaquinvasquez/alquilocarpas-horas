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
	email: string
}

export type UserMovementsType = {
	userId: IdType
	type: string
	date: string
}

export interface AppContextType {
	users: UserType[]
	user: UserType | null
	userMovements: Record<string, UserMovementsType[]>
	selectUser: (userId: string) => void
	lastKeyReaded: KeyType | null
	readKey: () => Promise<void>
}

export type User = {
	uid: string
	email: string
}

export type LoginInfo = {
	allowed: boolean
	admin: boolean
}

export type AuthStatus = {
	declined: boolean
	message: string
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
	readKey: (key: KeyType, userToken: string | null) => Promise<void>
	getUserPermission: (
		user: User,
		userToken: string | null
	) => Promise<LoginInfo>
}

export interface AuthContextType {
	logOut: () => void
	isAdmin: boolean,
	userEmail: string | null,
	userToken: string | null | null
}