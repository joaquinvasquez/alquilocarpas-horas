import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Minus from "../assets/images/minus.svg"
import MinusRed from "../assets/images/minus-red.svg"
import Plus from "../assets/images/plus-black.svg"
import PlusGreen from "../assets/images/plus-green.svg"
import Trash from "../assets/images/trash.svg"
import TimePicker from "../components/TimePicker"
import Modal from "../components/Modal"
import AppContext from "../context/AppContext"
import type { UserType } from "../types"

const Edit = (): JSX.Element => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const [timeType, setTimeType] = useState<boolean>(true)
	const { SelectUser, user } = useContext(AppContext)
	const [updatedUser, setUpdatedUser] = useState<Partial<UserType>>({})
	const { userId } = useParams()
	const [modalInfo, setModalInfo] = useState({ title: "", description: "" })

	const MinusSelected = timeType ? Minus : MinusRed
	const PlusSelected = timeType ? PlusGreen : Plus

	const handleShowModal = (type: string) => {
		if (type === "delete") {
			setModalInfo({
				title: "Eliminar",
				description: "¿Estás seguro de que deseas eliminar este usuario?"
			})
		} else {
			setModalInfo({
				title: "Guardar",
				description: "¿Estás seguro de que deseas guardar los cambios?"
			})
		}
		setShowModal(true)
	}

	useEffect(() => {
		if (userId && userId !== "new") {
			SelectUser(userId)
		}
	}, [userId])
	useEffect(() => {
		if (user) {
			setUpdatedUser(user)
		}
	}, [user])

	return (
		<div className='edit'>
			{userId !== "new" ? <h1>Editar {user?.name}</h1> : <h1>Nuevo</h1>}
			<div className='input-group'>
				<label htmlFor='name'>Nombre</label>
				<input
					type='text'
					id='name'
					value={updatedUser.name}
					onChange={(e) =>
						setUpdatedUser({ ...updatedUser, name: e.target.value })
					}
				/>
			</div>
			<div className='input-group'>
				<label htmlFor='userKey'>Key</label>
				<input
					type='text'
					id='userKey'
					value={updatedUser.key}
					onChange={(e) =>
						setUpdatedUser({ ...updatedUser, key: e.target.value })
					}
				/>
			</div>
			{userId !== "new" && (
				<div className='input-group time-group'>
					<div className='time'>
						<label htmlFor='time'>Horas</label>
						<TimePicker />
					</div>
					<div className='radio-btn'>
						<input type='radio' checked={timeType} readOnly />
						<label
							htmlFor='negative'
							onClick={() => setTimeType(true)}
							onKeyDown={() => setTimeType(true)}
						>
							<img src={MinusSelected} alt='minus' />
						</label>
					</div>
					<div className='radio-btn'>
						<input type='radio' checked={!timeType} readOnly />
						<label
							htmlFor='positive'
							onClick={() => setTimeType(false)}
							onKeyDown={() => setTimeType(false)}
						>
							<img src={PlusSelected} alt='plus' />
						</label>
					</div>
				</div>
			)}
			<div className='input-group'>
				<label htmlFor='hours-scheme'>Cantidad de horas diarias</label>
				<input
					type='number'
					inputMode='numeric'
					id='hours-scheme'
					value={updatedUser.daily_hours}
					onChange={(e) =>
						setUpdatedUser({
							...updatedUser,
							daily_hours: Number.parseInt(e.target.value)
						})
					}
				/>
			</div>
			<div className='btn-group'>
				{userId !== "new" && (
					<span
						className='delete'
						onClick={() => handleShowModal("delete")}
						onKeyDown={() => handleShowModal("delete")}
					>
						<img src={Trash} alt='trash-can' />
					</span>
				)}
				<button
					type='button'
					className={`save ${userId === "new" && "mt"} btn-clear`}
					onClick={() => handleShowModal("save")}
				>
					Guardar
				</button>
			</div>
			{showModal && (
				<Modal
					modalInfo={modalInfo}
					close={setShowModal}
					action={setShowModal}
				/>
			)}
		</div>
	)
}

export default Edit
