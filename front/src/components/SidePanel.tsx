import { useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Plus from "../assets/images/plus.svg"
import Right from "../assets/images/chevron-right.svg"
import Pencil from "../assets/images/pencil.svg"
import Refresh from "../assets/images/refresh.svg"
import AppContext from "../context/AppContext"

const SidePanel = (): JSX.Element => {
	const [usersDropdown, setUsersDropdown] = useState<boolean>(true)
	const { users, lastKeyReaded, updateLastKeyReaded } = useContext(AppContext)
	const refButtonUsers = useRef<HTMLButtonElement>(null)

	const handleUsersDropdown = () => {
		setUsersDropdown((val) => !val)
		refButtonUsers.current?.classList.toggle("inactive")
	}
	return (
		<div className='side-panel'>
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
					{
						users.map((user) => (
							<span className='user-item' key={user.id}>
								<span>{user.name}</span>
								<Link to={`/edit-user/${user.id}`}>
									<img src={Pencil} alt='edit user' />
								</Link>
							</span>
						))
					}
				</div>
			)}
			<Link to='/edit-user/new' className='btn-clear'>
				<img src={Plus} alt='menu button' />
				usuario
			</Link>
			<div className='last-readed'>
				<img
					src={Refresh}
					alt='refresh button'
					onClick={() => updateLastKeyReaded()}
					onKeyDown={() => updateLastKeyReaded()}
				/>
				Última lectura:
				<div>{lastKeyReaded}</div>
			</div>
		</div>
	)
}

export default SidePanel