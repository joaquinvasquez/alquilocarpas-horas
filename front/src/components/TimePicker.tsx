import { useState } from 'react'
import Clock from '../assets/images/clock.svg'

const TimePicker = (): JSX.Element => {
  const [hours, setHours] = useState<string>('00')
  const [minutes, setMinutes] = useState<string>('00')

  const formatTime = (time: string, min: boolean = false): string => {
    if (min && Number(time) > 59) return '59'
    return Number(time) < 10 ? `0${Number(time)}` : Number(time).toString()
  }

  return (
    <div className="time-picker">
      <input
        type="number"
        inputMode="numeric"
        id="hours"
        value={hours}
        onChange={(e) => setHours(formatTime(e.target.value))}
      />
      <span>:</span>
      <input
        type="number"
        inputMode="numeric"
        value={minutes}
        onChange={(e) => setMinutes(formatTime(e.target.value, true))}
      />
      <label htmlFor="hours">
        <img src={Clock} alt="" />
      </label>
    </div>
  )
}

export default TimePicker
