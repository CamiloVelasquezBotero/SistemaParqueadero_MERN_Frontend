import { Link } from 'react-router-dom';
import { useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import useVehiculos from '../hooks/useVehiculos.jsx';

const Main = () => {
  // Inputs
  const [placa, setPlaca] = useState('');
  const [nombrePropietario, setNombrePropietario] = useState('');
  const [tipoDeVehiculo, setTipoDeVehiculo] = useState('');
  const [stringSubmit, setStringSubmit] = useState('Guardar');
  // Desactivar botones y campos
  const [submitDesactivado, setSubmitDesactivado] = useState(true)
  const [agregarDesactivado, setAgregarDesactivado] = useState(false);
  const [eliminarDesactivado, setEliminarDesactivado] = useState(false);
  const [campoPlaca, setCampoPlaca] = useState(true);
  const [campoNombre, setCampoNombre] = useState(true);
  const [campoRadio, setCampoRadio] = useState(true);
  // Alerta
  const [alerta, setAlerta] = useState({});
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [cerrarAlerta, setCerrarAlerta] = useState(false);
  // CustomHook
  const {
    registrarVehiculo, 
    eliminarVehiculo, 
    valorPagar, 
    getVehiculos, 
    setVehiculosTable,
    vehiculosTable
  } = useVehiculos();

  const handleAgregar = () => {
    setEliminarDesactivado(false);
    setAgregarDesactivado(true);
    setSubmitDesactivado(false)
    setCampoPlaca(false)
    setCampoNombre(false)
    setCampoRadio(false)
    setStringSubmit('Guardar')
  }
  const handleEliminar = () => {
    setAgregarDesactivado(false);
    setEliminarDesactivado(true);
    setSubmitDesactivado(false)
    setCampoPlaca(false)
    setCampoNombre(true);
    setCampoRadio(true);
    setStringSubmit('Eliminar')
  }

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Agregar Nuevo Vehiculo
    if(agregarDesactivado) {
      if(!comprobarCampos()) {
        return
      }
      const response = await registrarVehiculo({placa, nombrePropietario, tipoDeVehiculo, horaEntrada: Date.now()})
      callAlert({
        msg: response.msg,
        error: response.error
      })

      if(response.error) {
        return
      }
      // Resetear Formulario
      setPlaca('');
      setNombrePropietario('');
      setTipoDeVehiculo('');
      const radioButtons = document.querySelectorAll('input[name="tipoDeVehiculo"]')
      radioButtons.forEach(radio => radio.checked = false);
    }

    // Eliminar Vehiculo
    if(eliminarDesactivado) {
      if(!comprobarCampoPlaca()){
        return;
      }
      // Valor a cobrar
      const msg = await valorPagar(placa)
      setAlerta({
        msg: msg,
        error: false
      })
      setMostrarAlerta(true)
      setCerrarAlerta(true);
      actualizarTable();
      const response = await eliminarVehiculo(placa)
      if(response.error) {
        return
      }
      // Resetear Formulario
      setPlaca('');
    }
  }

  const actualizarTable = async () => {
    const vehiculosActualizados = await vehiculosTable.map( vehiculo => vehiculo.placa !== placa);
    setVehiculosTable(vehiculosActualizados);
  }

  const comprobarCampoPlaca = () => {
    if(placa === ''){
      return callAlert({
        msg: 'Ingresa la placa a Eliminar',
        error: true
      })
    }
    if(placa.length <= 5) {
      return callAlert({
        msg: 'La placa debe tener minimo 6 caracteres',
        error: true
      })
    }
    return true
  }

  const comprobarCampos = () => {
    if([placa, nombrePropietario, tipoDeVehiculo].includes('')){
      return callAlert({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
    }
    if(placa.length < 6 || placa.length > 6) {
      return callAlert({
        msg: 'La Placa debe tener 6 Caracteres',
        error: true
      })
    }
    return true
  }

  const callAlert = ({msg, error}) => {
    setAlerta({
      msg,
      error
    })

    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
    },4000);
  }
  
  const handleClick = () => {
    setMostrarAlerta(false);
    setCerrarAlerta(false);
  }

  return (
    <>

      <div className="row">
        <div className="col-12 col-md-7 ">
            {mostrarAlerta && <Alerta alerta={alerta} />}
          <div className='cerrarAlerta'>
            {cerrarAlerta && <button type='button' onClick={handleClick}>Cerrar</button>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className='inputText'>
              <div>
                <label htmlFor="placa">Placa:</label>
                <input type="text" className='placa' id='placa' 
                  value={placa}
                  disabled={campoPlaca}
                  onChange={e => setPlaca(e.target.value.toUpperCase())}
                />
              </div>
              <div className='py-4'>
                <label htmlFor="nombrePropietario">Popietario del Vehiculo:</label>
                <input type="text" className='nombrePropietario' id='nombrePropietario'
                  value={nombrePropietario}
                  disabled={campoNombre}
                  onChange={e => setNombrePropietario(e.target.value)}
                />
              </div>
            </div>
            <div className='tipoDeVehiculo'>
                <div>
                  <label htmlFor="motocicleta">Motocicleta</label>
                  <input type="radio" name='tipoDeVehiculo' value='Motocicleta' id='motocicleta'
                    disabled={campoRadio}
                    onClick={e => setTipoDeVehiculo(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="automovil" className='labelAutomovil'>Automovil</label>
                  <input type="radio" name='tipoDeVehiculo' value='Automovil' id='automovil'
                    disabled={campoRadio}
                    onClick={e => setTipoDeVehiculo(e.target.value)}
                  />
                </div>
            </div>  
            <div className='submit'>
              <input type="submit" 
                value={stringSubmit}
                disabled={submitDesactivado}
                style={{ opacity: submitDesactivado ? 0.6 : 1 }}
              />
            </div>
          </form>
        </div>

        <div className='col-12 col-md-5'>
          <div className="logoParqueadero ">
            <img src="imagenes/Parking.png" alt="Logo Parqueadero" className='img-fluid'/>
          </div>
          <div className='botonesEjecucion'>
            <button type='button' className='agregar'
              onClick={handleAgregar}
              disabled={agregarDesactivado}
              style={{ opacity: agregarDesactivado ? 0.6 : 1 }}
            >Agregar</button>
            <button type='button' className='eliminar'
              onClick={handleEliminar}
              disabled={eliminarDesactivado}
              style={{ opacity: eliminarDesactivado ? 0.6 : 1 }}
            >Remover</button>
            <div>
              <Link to='/vehiculosRegistrados' className='link'>Vehiculos Registrados</Link>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Main