import type { FC, ChangeEvent } from "react"
import type { ValidationError } from "yup"

interface Props {
	labelText: string
	type?: string
	id: string
	updatedUserValue: string | number
	setUpdatedUser: (e: ChangeEvent<HTMLInputElement>) => void
	error?: ValidationError
}

const InputGroup: FC<Props> = ({
	labelText,
	type,
	id,
	updatedUserValue,
	setUpdatedUser,
	error
}) => {
	return (
		<div className='input-group'>
			<label>
				{labelText}
				<input
					type={type || "text"}
					id={id}
					value={updatedUserValue}
					onChange={setUpdatedUser}
					autoComplete='off'
				/>
			</label>
			{error && <span className='error'>{error.message}</span>}
		</div>
	)
}

export default InputGroup
