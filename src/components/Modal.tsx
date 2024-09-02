interface Props {
  modalInfo: {
    title: string
    description: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: any
  close: (val: boolean) => void
}

const Modal: React.FC<Props> = ({ modalInfo, action = () => {}, close }) => {
  const { title, description } = modalInfo
  return (
    <>
      <div className="modal-back">
        <div className="modal">
          <h2>{title}</h2>
          <p>{description}</p>
          <div>
            <button className="btn-clear" onClick={() => close(false)}>
              Cancelar
            </button>
            <button className="btn-clear" onClick={() => action()}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
