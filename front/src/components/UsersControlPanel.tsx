import { useContext, useRef, useState } from "react"
import AppContext from "../context/AppContext"
import { Link } from "react-router-dom"
import Plus from "../assets/images/plus.svg"
import Right from "../assets/images/chevron-right.svg"
import Refresh from "../assets/images/Refresh"
import Pencil from "../assets/images/Pencil"

const UsersControlPanel = (): JSX.Element => {
	const [usersDropdown, setUsersDropdown] = useState<boolean>(true)
	const { users, lastKeyReaded, updateLastKeyReaded } = useContext(AppContext)
	const refButtonUsers = useRef<HTMLButtonElement>(null)

	const handleUsersDropdown = () => {
		setUsersDropdown((val) => !val)
		refButtonUsers.current?.classList.toggle("inactive")
	}
	return (
		<>
			<button
				type='button'
				className='users-btn  btn-clear'
				onClick={handleUsersDropdown}
				ref={refButtonUsers}
			>
				<img src={Right} alt='right chevron' />
				usuarios
			</button>
			{usersDropdown && (
				<div className='user-list'>
					{users.map((user) => (
						<span className='user-item' key={user.id}>
							<Link to={`/view/${user.id}`}>{user.name}</Link>
							<Link to={`/edit/${user.id}`}>
								<Pencil />
							</Link>
						</span>
					))}
				</div>
			)}
			<Link to='/edit/new' className='btn-clear'>
				<img src={Plus} alt='menu button' />
				usuario
			</Link>
			<div className='last-readed'>
				<Refresh
					onClick={() => updateLastKeyReaded()}
					onKeyDown={() => updateLastKeyReaded()}
				/>
				Última lectura:
				<div>{lastKeyReaded}</div>
			</div>
		</>
	)
}

export default UsersControlPanel
