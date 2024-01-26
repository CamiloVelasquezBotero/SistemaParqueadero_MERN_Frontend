/* eslint-disable react/prop-types */

const Alerta = ({alerta}) => {
  return (
    <>
        <div className={alerta.error ? 'alertaError bg-danger' : 'alertaExito'}>
            {alerta.msg}
        </div>
    </>
  )
}

export default Alerta