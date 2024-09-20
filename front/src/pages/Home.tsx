import { useContext } from "react"
import AppContext from "../context/AppContext"

const formatTime = (minutes = 0): string => {
	const hours = Math.floor(minutes / 60)
	const restMinutes = minutes % 60
	return restMinutes < 10
		? `${hours}:0${restMinutes}`
		: `${hours}:${restMinutes}`
}

const formatDateTime = (userDate = ""): string => {
	const date = new Date(userDate)
	const day: string = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
	const month: string = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
	const year: number = date.getFullYear()
	const hours: string = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}`
	const minutes: string = `${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
	const seconds: string = `${date.getSeconds() < 10 ? "0" : ""}${date.getSeconds()}`
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const Home = (): JSX.Element => {
	const { user } = useContext(AppContext)
	return (
		<div className='home'>
			<div className='data'>
				<h1>{user?.name}</h1>
				<div className={`hours ${user?.minutes && user?.minutes < 0 && "neg"}`}>
					{formatTime(user?.minutes)}
				</div>
				<p>Última vez que fichó: {formatDateTime(user?.last_reading)}</p>
			</div>
		</div>
	)
}

export default Home
