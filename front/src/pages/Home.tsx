import { useContext } from "react"
import AppContext from "../context/AppContext"
import { Link } from "react-router-dom"

const Home = (): JSX.Element => {
	const { users } = useContext(AppContext)
	return (
		<div className='home'>
			<div className='data'>
				<h1>Usuarios</h1>
				<ul>
					{users.map((user) => (
						<li key={user.id}>
							<Link to={`/view/${user.id}`}>{user.name}</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Home
