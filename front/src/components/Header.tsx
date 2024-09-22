import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Logo from "../assets/images/logo.svg"
import Menu from "../assets/images/menu-header.svg"
import MenuAux from "../assets/images/menu-header-aux.svg"
import UsersControlPanel from "./UsersControlPanel"

const Header = (): JSX.Element => {
	const [dropdown, setDropdown] = useState(false)
	const loc = useLocation()
	const refNav = useRef<HTMLElement>(null)
	const refButtonUsers = useRef<HTMLButtonElement>(null)

	const handleDrowdown = () => {
		setDropdown((val) => !val)
		refNav.current?.classList.toggle("active")
	}

	const handleResetDropdown = () => {
		setDropdown(false)
		refNav.current?.classList.remove("active")
		refButtonUsers.current?.classList.remove("inactive")
	}

	useEffect(() => {
		handleResetDropdown()
	}, [loc.pathname])

	const MenuSelected = dropdown ? MenuAux : Menu

	return (
		<header>
			<Link to='/'>
				<img src={Logo} alt='logo' />
			</Link>
			<nav ref={refNav}>
				<img
					className='dropdown-btn'
					onClick={handleDrowdown}
					onKeyDown={handleDrowdown}
					src={MenuSelected}
					alt='menu button'
				/>
				{dropdown && (
					<div className='dropdown-cont'>
						<UsersControlPanel />
					</div>
				)}
			</nav>
		</header>
	)
}

export default Header
