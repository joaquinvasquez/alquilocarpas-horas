import type { AppServiceType, UserType } from "../types"

const baseURL = "https://api-22y3pisekq-uc.a.run.app"

export const AppService: AppServiceType = {
	getAllUsers: async () => {
		const response = await fetch(`${baseURL}/users`)
		return response.json()
	},
	getUser: async (userId: string) => {
		const response = await fetch(`${baseURL}/users/${userId}`)
		return response.json()
	},
	createUser: async (userData: Partial<UserType>) => {
		const response = await fetch(`${baseURL}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	updateUser: async (userId: string, userData: Partial<UserType>) => {
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	deleteUser: async (userId: string) => {
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "DELETE"
		})
		return response.json()
	},
	getLastKeyReaded: async () => {
		const response = await fetch(`${baseURL}/key/last-readed`)
		const key = await response.json()
		return key.last_read
	}
}
