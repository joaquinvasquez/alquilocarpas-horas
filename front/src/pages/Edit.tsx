import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Minus from '../assets/images/minus.svg'
import MinusRed from '../assets/images/minus-red.svg'
import Plus from '../assets/images/plus-black.svg'
import PlusGreen from '../assets/images/plus-green.svg'
import Trash from '../assets/images/trash.svg'
import TimePicker from '../components/TimePicker'
import Modal from '../components/Modal'

const Edit = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [timeType, setTimeType] = useState<boolean>(true)
  const { userId } = useParams()
  const [modalInfo, setModalInfo] = useState({ title: '', description: '' })

  const MinusSelected = timeType ? Minus : MinusRed
  const PlusSelected = timeType ? PlusGreen : Plus

  const handleShowModal = (type: string) => {
    if (type === 'delete') {
      setModalInfo({
        title: 'Eliminar',
        description: '¿Estás seguro de que deseas eliminar este usuario?',
      })
    } else {
      setModalInfo({
        title: 'Guardar',
        description: '¿Estás seguro de que deseas guardar los cambios?',
      })
    }
    setShowModal(true)
  }

  return (
    <div className="edit">
      {userId !== 'new' ? <h1>Editar {userId}</h1> : <h1>Nuevo</h1>}
      <div className="input-group">
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" />
      </div>
      <div className="input-group">
        <label htmlFor="userKey">Key</label>
        <input type="text" id="userKey" />
      </div>
      <div className="input-group time-group">
        <div className="time">
          <label htmlFor="time">Horas</label>
          <TimePicker />
        </div>
        <div className="radio-btn">
          <input type="radio" checked={timeType} readOnly />
          <label htmlFor="negative" onClick={() => setTimeType(true)}>
            <img src={MinusSelected} alt="minus" />
          </label>
        </div>
        <div className="radio-btn">
          <input type="radio" checked={!timeType} readOnly />
          <label htmlFor="positive" onClick={() => setTimeType(false)}>
            <img src={PlusSelected} alt="plus" />
          </label>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="hours-scheme">Cantidad de horas diarias</label>
        <input type="number" inputMode="numeric" id="hours-scheme" />
      </div>
      <div className="btn-group">
        <span className="delete" onClick={() => handleShowModal('delete')}>
          <img src={Trash} alt="trash-can" />
        </span>
        <button
          className="save btn-clear"
          onClick={() => handleShowModal('save')}
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
