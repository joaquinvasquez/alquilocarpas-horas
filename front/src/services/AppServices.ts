import type { AppServiceType } from "../types"

const baseURL = "https://api-22y3pisekq-uc.a.run.app"

export const AppService: AppServiceType = {
	getAllUsers: async () => {
		const response = await fetch(`${baseURL}/users`)
		return response.json()
	},
	createUser: async (userData) => {
		const response = await fetch(`${baseURL}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	updateUser: async (userData, userId) => {
		console.log("updateUser", userData, userId)
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	deleteUser: async (userId) => {
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "DELETE"
		})
		return response.json()
	},
	getLastKeyReaded: async () => {
		const response = await fetch(`${baseURL}/key/last-readed`)
		const key = await response.json()
		return key.last_read
	},
	getUserPermission: async (user) => {
		const res = await fetch(
			"http://127.0.0.1:5001/alquilocarpas-horas/us-central1/api/users/allowed",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ uid: user.uid, email: user.email })
			}
		)
		const data = await res.json()
		return data.allowed
	}
}
