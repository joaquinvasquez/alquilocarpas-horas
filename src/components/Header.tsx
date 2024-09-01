import { useEffect, useRef, useState } from 'react'
import Logo from '../assets/images/logo.svg'
import Menu from '../assets/images/menu-header.svg'
import MenuAux from '../assets/images/menu-header-aux.svg'
import Plus from '../assets/images/plus.svg'
import Right from '../assets/images/chevron-right.svg'
import Pencil from '../assets/images/pencil.svg'
import { Link, useLocation } from 'react-router-dom'

const Header = (): JSX.Element => {
  const [dropdown, setDropdown] = useState(false)
  const [usersDropdown, setUsersDropdown] = useState(true)
  const loc = useLocation()
  const refNav = useRef<HTMLElement>(null)
  const refButtonUsers = useRef<HTMLButtonElement>(null)

  const handleDrowdown = () => {
    setDropdown((val) => !val)
    refNav.current?.classList.toggle('active')
  }

  const handleUsersDropdown = () => {
    setUsersDropdown((val) => !val)
    refButtonUsers.current?.classList.toggle('inactive')
  }

  const handleResetDropdown = () => {
    setDropdown(false)
    setUsersDropdown(true)
    refNav.current?.classList.remove('active')
    refButtonUsers.current?.classList.remove('inactive')
  }

  useEffect(() => {
    handleResetDropdown()
  }, [loc.pathname])

  const MenuSelected = dropdown ? MenuAux : Menu

  return (
    <header>
      <Link to="/">
        <img src={Logo} alt="logo" />
      </Link>
      <nav ref={refNav}>
        <img
          className="dropdown-btn"
          onClick={handleDrowdown}
          src={MenuSelected}
          alt="menu button"
        />
        {dropdown && (
          <div className="dropdown-cont">
            <button
              className="users-btn"
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
            <Link to="/edit/new">
              <img src={Plus} alt="menu button" />
              usuario
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
