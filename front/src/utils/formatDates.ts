export const formatUserTime = (minutes = 0): string => {
	const hours = Math.floor(Math.abs(minutes / 60))
	const restMinutes = Math.abs(minutes % 60)
	return minutes < 0
		? `-${hours}:${restMinutes < 10 ? "0" : ""}${restMinutes}`
		: `${hours}:${restMinutes < 10 ? "0" : ""}${restMinutes}`
}

export const formatDateTime = (userDate = ""): string => {
	const date = new Date(userDate)
	const day: string = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
	const month: string = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
	const year: number = date.getFullYear()
	const hours: string = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}`
	const minutes: string = `${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
	const seconds: string = `${date.getSeconds() < 10 ? "0" : ""}${date.getSeconds()}`
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export const formatDate = (userDate = ""): string => {
	const date = new Date(userDate)
	const day: string = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
	const month: string = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
	const year: number = date.getFullYear()
	return `${day}/${month}/${year}`
}

export const formatTime = (userDate = ""): string => {
	const date = new Date(userDate)
	const hours: string = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}`
	const minutes: string = `${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
	const seconds: string = `${date.getSeconds() < 10 ? "0" : ""}${date.getSeconds()}`
	return `${hours}:${minutes}:${seconds}`
}

export const formatDateToInput = (userDate = ""): string => {
	const date = new Date(userDate)
	const day: string = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
	const month: string = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
	const year: number = date.getFullYear()
	return `${year}-${month}-${day}`
}
