export type KeyType = string

export type UserType = {
	id: string
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
  user: UserType | null
  SelectUser: (userId: string) => void
  lastKeyReaded: KeyType | null
  updateLastKeyReaded: () => Promise<void>
}

export interface AppServiceType {
  getAllUsers: () => Promise<UserType[]>
  getUser: (userId: string) => Promise<UserType>
  createUser: (userData: Partial<UserType>) => Promise<UserType>
  updateUser: (userId: string, userData: Partial<UserType>) => Promise<UserType>
  deleteUser: (userId: string) => Promise<UserType>
  getLastKeyReaded: () => Promise<KeyType>
}
