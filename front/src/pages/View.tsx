import { type JSX, useContext, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AppContext from "../context/AppContext"
import Pencil from "../assets/images/Pencil"
import {
	formatDateTime,
	formatDateToInput,
	formatTime,
	formatUserTime
} from "../utils/formatDates"
import Calendar from "../assets/images/Calendar"

const View = (): JSX.Element => {
	const { userId } = useParams()
	const { users, user, userMovements, selectUser, readKey } =
		useContext(AppContext)
	const [selectedDate, setSelectedDate] = useState<string>(
		formatDateToInput(new Date().toString())
	)
	const movementsRef = useRef<Record<string, HTMLDivElement | null>>({})

	const setMovementRef = (date: string, el: HTMLDivElement | null) => {
		if (el) {
			const [day, month, year] = date.split("/")
			const formattedDate = `${year}-${month}-${day}`
			movementsRef.current[formattedDate] = el
		}
	}

	useEffect(() => {
		if (userId) {
			selectUser(userId)
		}
	}, [userId, users])

	useEffect(() => {
		const element = movementsRef.current[selectedDate] || null
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "center"
			})
			element.classList.add("selected")
		}

		return () => {
			if (element) {
				element.classList.remove("selected")
			}
		}
	}, [selectedDate, userMovements])

	return (
		<div className='view'>
			<div className='data'>
				<Link className='edit-btn' to={`/edit/${user?.id}`}>
					<Pencil />
				</Link>
				<h1>{user?.name}</h1>
				<div className={`hours ${user?.minutes && user?.minutes < 0 && "neg"}`}>
					{formatUserTime(user?.minutes)}
				</div>
				<p>Horas diarias de trabajo: {user?.daily_hours}</p>
				<p>Última vez que fichó: {formatDateTime(user?.last_reading)}</p>
				<div className='activate-user'>
					<button
						className='btn-clear hello'
						onClick={() => readKey()}
						disabled={user?.is_active}
					>
						Fichar entrada
					</button>
					<button
						className='btn-clear bye'
						onClick={() => readKey()}
						disabled={!user?.is_active}
					>
						Fichar salida
					</button>
				</div>
			</div>
			<div className='movements'>
				<div className='movements-header'>
					<h2>Historial</h2>
					<input
						type='date'
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					/>
					<span className='calendar'>
						<Calendar />
					</span>
				</div>
				<div className='list'>
					{Object.entries(userMovements)
						.sort()
						.map(([date, movements]) => (
							<div
								key={date}
								className='date'
								ref={(el) => setMovementRef(date, el)}
							>
								<h3>{date}</h3>
								{movements.map((movement, index) => (
									<div key={index} className='movement'>
										<p>
											{formatTime(movement.date)} - {movement.type}
										</p>
									</div>
								))}
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default View
