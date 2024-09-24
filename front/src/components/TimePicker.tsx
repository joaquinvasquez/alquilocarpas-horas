import { useEffect, useState } from "react"
import Clock from "../assets/images/clock.svg"
import Minus from "../assets/images/minus.svg"
import MinusRed from "../assets/images/minus-red.svg"
import Plus from "../assets/images/plus-black.svg"
import PlusGreen from "../assets/images/plus-green.svg"
import type { ValidationError } from "yup"

interface Props {
	updatedUserMinutesValue: number
	setUpdatedUser: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: ValidationError
}

const TimePicker: React.FC<Props> = ({
	updatedUserMinutesValue,
	setUpdatedUser,
	error
}) => {
	const [timeType, setTimeType] = useState<boolean>(true)

	const [hours, setHours] = useState("00")
	const [mins, setMins] = useState("00")

	const MinusSelected = timeType ? Minus : MinusRed
	const PlusSelected = timeType ? PlusGreen : Plus

	const formatTime = (time: string, min = false): string => {
		if (min && Number(time) > 59) return "59" // input control for minutes
		return Number(time) < 10 ? `0${Number(time)}` : Number(time).toString()
	}

	useEffect(() => {
		const time = Math.abs(updatedUserMinutesValue)
		const hours = Math.floor(time / 60)
		const mins = time % 60
		setHours(formatTime(hours.toString()))
		setMins(formatTime(mins.toString(), true))
		setTimeType(updatedUserMinutesValue < 0)
	}, [updatedUserMinutesValue])

	useEffect(() => {
		const time = timeType
			? -1 * (Number(hours) * 60 + Number(mins))
			: Number(hours) * 60 + Number(mins)
		setUpdatedUser({
			target: { value: time.toString() }
		} as React.ChangeEvent<HTMLInputElement>)
	}, [hours, mins, timeType])

	return (
		<div className='input-group time-group'>
			<div className='time'>
				<label htmlFor='time'>
					Horas
					<div className='time-picker'>
						<input
							type='number'
							inputMode='numeric'
							id='hours'
							value={hours}
							onChange={(e) => setHours(formatTime(e.target.value))}
						/>
						<span>:</span>
						<input
							type='number'
							inputMode='numeric'
							value={mins}
							onChange={(e) => setMins(formatTime(e.target.value, true))}
						/>
						<label htmlFor='hours'>
							<img src={Clock} alt='' />
						</label>
					</div>
				</label>
				{error && <span className='error'>{error.message}</span>}
			</div>
			<div className='radio-btn'>
				<input type='radio' checked={timeType} readOnly />
				<label
					htmlFor='negative'
					onClick={() => setTimeType(true)}
					onKeyDown={() => setTimeType(true)}
				>
					<img src={MinusSelected} alt='minus' />
				</label>
			</div>
			<div className='radio-btn'>
				<input type='radio' checked={!timeType} readOnly />
				<label
					htmlFor='positive'
					onClick={() => setTimeType(false)}
					onKeyDown={() => setTimeType(false)}
				>
					<img src={PlusSelected} alt='plus' />
				</label>
			</div>
		</div>
	)
}

export default TimePicker
