import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Minus from '../assets/images/minus.svg'
import Plus from '../assets/images/plus.svg'
import Trash from '../assets/images/trash.svg'

const Edit = (): JSX.Element => {
  const [showModal, setShowModal] = useState<string | null>(null)
  const { userId } = useParams()
  return (
    <div className="edit">
      {userId !== 'new' ? <h1>Editar</h1> : <h1>Nuevo</h1>}
      <div className="input-group">
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" />
      </div>
      <div className="input-group">
        <label htmlFor="userKey">Key</label>
        <input type="text" id="userKey" />
      </div>
      <div className="input-group">
        <label htmlFor="time">Horas</label>
        <input type="time" id="time" />
        <input type="radio" name="time_type" id="negative" />
        <label htmlFor="negative">
          <img src={Minus} alt="minus" />
        </label>
        <input type="radio" name="time_type" id="positive" />
        <label htmlFor="positive">
          <img src={Plus} alt="plus" />
        </label>
      </div>
      <div className="input-group">
        <label htmlFor="hours-scheme">Cantidad de horas</label>
        <input type="number" id="hours-scheme" />
      </div>
      <span className="delete" onClick={() => setShowModal('delete')}>
        <img src={Trash} alt="trash-can" />
      </span>
      <span className="save" onClick={() => setShowModal('save')}>
        Guardar
      </span>
      {showModal && (
        <>
          <div className="modal-back">
            <div className="modal">
              <h2>Titulo</h2>
              <p>Descripcion</p>
              <button onClick={() => setShowModal(null)}>Cancelar</button>
              <button>Aceptar</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Edit
