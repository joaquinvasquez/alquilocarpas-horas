import { useContext } from "react"
import type { UserType } from "../types"
import AppContext from "../context/AppContext"
import { useNavigate } from "react-router-dom"

interface Props {
	modalInfo: {
		title: string
		description: string
		user: string
	}
	action?: () => Promise<UserType>
	close: (val: boolean) => void
}

const Modal: React.FC<Props> = ({ modalInfo, action, close }) => {
	const { title, description } = modalInfo
	const { fetchUsers } = useContext(AppContext)
	const nav = useNavigate()

	const saveFunction = async () => {
		if (action) await action()
		await fetchUsers()
		close(false)
		nav(`/view/${modalInfo.user}`)
	}

	return (
		<>
			<div className='modal-back'>
				<div className='modal'>
					<h2>{title}</h2>
					<p>{description}</p>
					<div>
						<button
							type='button'
							className='btn-clear'
							onClick={() => close(false)}
						>
							Cancelar
						</button>
						<button type='button' className='btn-clear' onClick={saveFunction}>
							Aceptar
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Modal
