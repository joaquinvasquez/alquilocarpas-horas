import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Trash from "../assets/images/trash.svg"
import TimePicker from "../components/TimePicker"
import Modal from "../components/Modal"
import AppContext from "../context/AppContext"
import type { UserType } from "../types"
import { AppServices } from "../services/AppServices"
import InputGroup from "../components/InputGroup"
import { updatedUserSchema } from "../schemas/validation"
import type { ValidationError } from "yup"
import AuthContext from "../context/AuthContext"

const defaultUser: Partial<UserType> = {
	name: "",
	key: "",
	daily_hours: 8
}

const Edit = (): JSX.Element => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const { selectUser, user, users } = useContext(AppContext)
	const [updatedUser, setUpdatedUser] = useState<Partial<UserType>>(defaultUser)
	const { userId } = useParams()
	const [modalInfo, setModalInfo] = useState({
		title: "",
		description: "",
		user: "",
		action: () => Promise.resolve(user)
	})
	const [errors, setErrors] = useState<ValidationError[] | null>(null)
	const { userToken } = useContext(AuthContext)

	const handleShowModal = (type: string) => {
		if (type === "delete") {
			setModalInfo({
				title: "Eliminar",
				description: "¿Estás seguro de que querés eliminar este usuario?",
				user: userId || "",
				action: () => AppServices.deleteUser(userId || "", userToken)
			})
		} else {
			setModalInfo(
				user
					? {
							title: "Guardar",
							description: "¿Estás seguro de que querés guardar los cambios?",
							user: userId || "",
							action: () =>
								AppServices.updateUser(updatedUser, user.id, userToken)
						}
					: {
							title: "Crear",
							description: "¿Estás seguro de que querés crear este usuario?",
							user: userId || "",
							action: () => AppServices.createUser(updatedUser, userToken)
						}
			)
		}

		updatedUserSchema
			.validate(updatedUser, { abortEarly: false })
			.then(() => {
				setErrors(null)
				setShowModal(true)
			})
			.catch((err) => {
				setErrors(err.inner as ValidationError[])
			})
	}

	useEffect(() => {
		if (userId) {
			selectUser(userId)
		}
	}, [userId, users])

	useEffect(() => {
		setUpdatedUser({ ...(user || defaultUser), minutes: 0 })
	}, [user])

	return (
		<div className='edit'>
			{userId !== "new" ? <h1>Editar {user?.name}</h1> : <h1>Crear usuario</h1>}
			<InputGroup
				labelText='Nombre'
				id='name'
				updatedUserValue={updatedUser.name || ""}
				setUpdatedUser={(e) =>
					setUpdatedUser({ ...updatedUser, name: e.target.value })
				}
				error={errors?.find((err) => err.path === "name")}
			/>
			<InputGroup
				labelText='Key'
				id='userKey'
				updatedUserValue={updatedUser.key?.toUpperCase() || ""}
				setUpdatedUser={(e) =>
					setUpdatedUser({ ...updatedUser, key: e.target.value })
				}
				error={errors?.find((err) => err.path === "key")}
			/>
			{userId !== "new" && (
				<TimePicker
					updatedUserMinutesValue={updatedUser.minutes || 0}
					setUpdatedUser={(e) =>
						setUpdatedUser({
							...updatedUser,
							minutes: Number.parseInt(e.target.value)
						})
					}
					error={errors?.find((err) => err.path === "minutes")}
				/>
			)}
			<InputGroup
				labelText='Horas diarias'
				id='daily-hours'
				type='number'
				updatedUserValue={updatedUser.daily_hours || ""}
				setUpdatedUser={(e) =>
					setUpdatedUser({
						...updatedUser,
						daily_hours: Number.parseInt(e.target.value)
					})
				}
				error={errors?.find((err) => err.path === "daily_hours")}
			/>
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
					{user ? "Guardar" : "Crear"}
				</button>
			</div>
			{showModal && <Modal modalInfo={modalInfo} close={setShowModal} />}
		</div>
	)
}

export default Edit
