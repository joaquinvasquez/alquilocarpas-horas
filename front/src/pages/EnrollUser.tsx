import { useContext, type JSX } from "react"
import { formatDateTime } from "./View"
import AppContext from "../context/AppContext"
import AuthContext from "../context/AuthContext"

const EnrollUser = (): JSX.Element => {
	const { user, readKey } = useContext(AppContext)
	const { logOut } = useContext(AuthContext)

	return (
		<div className='enroll-user'>
			<div className='data'>
				<h1>{user?.name}</h1>
				{/* <div className={`hours ${user?.minutes && user?.minutes < 0 && "neg"}`}>
					{formatTime(user?.minutes)}
				</div> */}
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
				<div className='logout'>
					<button className='btn-clear' onClick={logOut}>
						Cerrar Sesión
					</button>
				</div>
			</div>
		</div>
	)
}

export default EnrollUser
