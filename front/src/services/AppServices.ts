import type { AppServiceType, LoginInfo } from "../types"

const baseURL = import.meta.env.VITE_API_BASE_URL

export const AppServices: AppServiceType = {
	getAllUsers: async (userToken) => {
		const response = await fetch(`${baseURL}/users`, {
			headers: {
				Authorization: `Bearer ${userToken}`
			}
		})
		return response.json()
	},
	createUser: async (userData, userToken) => {
		const response = await fetch(`${baseURL}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userToken}`
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	updateUser: async (userData, userId, userToken) => {
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userToken}`
			},
			body: JSON.stringify(userData)
		})
		return response.json()
	},
	deleteUser: async (userId, userToken) => {
		const response = await fetch(`${baseURL}/users/${userId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${userToken}`
			}
		})
		return response.json()
	},
	getLastKeyReaded: async (userToken) => {
		const response = await fetch(`${baseURL}/key/last-readed`, {
			headers: {
				Authorization: `Bearer ${userToken}`
			}
		})
		const key = await response.json()
		return key.last_read
	},
	readKey: async (key, userToken) => {
		const response = await fetch(`${baseURL}/key/read/${key}`, {
			headers: {
				Authorization: `Bearer ${userToken}`
			}
		})
		const data = await response.json()
		return data.action
	},
	getUserPermission: async (user, userToken) => {
		const res = await fetch(`${baseURL}/users/allowed`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userToken}`
			},
			body: JSON.stringify({ uid: user.uid, email: user.email })
		})
		const data: LoginInfo = await res.json()
		return data
	}
}
