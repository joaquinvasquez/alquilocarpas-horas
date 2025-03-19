import type { FC } from "react"
import type { UserType } from "../types"
import { useNavigate } from "react-router-dom"

interface Props {
	modalInfo: {
		title: string
		description: string
		user: string
		action?: () => Promise<UserType | null >
	}
	close: (val: boolean) => void
}

const Modal: FC<Props> = ({ modalInfo, close }) => {
	const { title, description, action } = modalInfo
	const nav = useNavigate()

	const saveFunction = () => {
		if (action) action()
		close(false)
		if (modalInfo.title === "Guardar" ) nav(`/view/${modalInfo.user}`)
		else nav("/")
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
