import * as yup from "yup"

export const updatedUserSchema = yup.object().shape({
	name: yup.string().required("Campo requerido"),
	key: yup
		.string()
		.required("Campo requerido")
		.matches(/[A-F0-9]{8}/, "Formato esperado: 8 dígitos (0-9, A-F)"),
	daily_hours: yup.number().required("Campo requerido").positive().integer(),
	minutes: yup.number().integer(),
	email: yup
		.string()
		.required("Campo requerido")
		.email("Formato de email incorrecto")
})
