import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Plus from '../assets/images/plus.svg'
import Right from '../assets/images/chevron-right.svg'
import Pencil from '../assets/images/pencil.svg'

const SidePanel = (): JSX.Element => {
  const [usersDropdown, setUsersDropdown] = useState(true)
  const refButtonUsers = useRef<HTMLButtonElement>(null)

  const handleUsersDropdown = () => {
    setUsersDropdown((val) => !val)
    refButtonUsers.current?.classList.toggle('inactive')
  }
  return (
    <div className="side-panel">
      <button
        className="users-btn  btn-clear"
        onClick={handleUsersDropdown}
        ref={refButtonUsers}
      >
        <img src={Right} alt="right chevron" />
        usuarios
      </button>
      {usersDropdown && (
        <div className="user-list">
          <span className="user-item">
            <span>User 1</span>
            <Link to="/edit/user1">
              <img src={Pencil} alt="edit user" />
            </Link>
          </span>
          <span className="user-item">
            <span>User 2</span>
            <Link to="/edit/user2">
              <img src={Pencil} alt="edit user" />
            </Link>
          </span>
          <span className="user-item">
            <span>User 3</span>
            <Link to="/edit/user3">
              <img src={Pencil} alt="edit user" />
            </Link>
          </span>
        </div>
      )}
      <Link to="/edit/new" className="btn-clear">
        <img src={Plus} alt="menu button" />
        usuario
      </Link>
    </div>
  )
}

export default SidePanel
