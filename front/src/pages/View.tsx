import { type JSX, useContext, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import AppContext from "../context/AppContext"
import Pencil from "../assets/images/Pencil"

export const formatTime = (minutes = 0): string => {
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

const View = (): JSX.Element => {
	const { userId } = useParams()
	const { users, user, selectUser, readKey } = useContext(AppContext)

	useEffect(() => {
		if (userId) {
			selectUser(userId)
		}
	}, [userId, users])

	return (
		<div className='view'>
			<div className='data'>
				<Link className='edit-btn' to={`/edit/${user?.id}`}>
					<Pencil />
				</Link>
				<h1>{user?.name}</h1>
				<div className={`hours ${user?.minutes && user?.minutes < 0 && "neg"}`}>
					{formatTime(user?.minutes)}
				</div>
				<p>Horas diarias de trabajo: {user?.daily_hours}</p>
				<p>Última vez que fichó: {formatDateTime(user?.last_reading)}</p>
				<div className='activate-user' onClick={() => readKey()}>
					Activo
					<span className={`btn-container ${user?.is_active && "active"}`}>
						<span className='ball' />
					</span>
				</div>
			</div>
		</div>
	)
}

export default View
