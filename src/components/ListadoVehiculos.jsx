/* eslint-disable react/prop-types */
import { useState, } from 'react';
import useVehiculos from '../hooks/useVehiculos.jsx';
import Alerta from './Alerta.jsx';

const ListadoVehiculos = () => {
    /* const [vehiculosState, setVehiculosState] = useState(vehiculos); */
    
    const [alerta, setAlerta] = useState({});
    const [mostrarAlerta, setMostrarAlerta] = useState(false)
    const [cerrarAlerta, setCerrarAlerta] = useState(false)
    const [mostrarEdicion, setMostrarEdicion] = useState(false);

    const { 
        getVehiculo, 
        eliminarVehiculo,
        setVehiculoEditar,
        setMostrarEdicionContext,
        vehiculosTable, setVehiculosTable,
        valorPagar
    } = useVehiculos();

    const handleClick = async (placa, ejecucion) => {

        if(ejecucion === 'editar') {
            const datos =  await getVehiculo(placa);
            setVehiculoEditar(datos);
            setMostrarEdicionContext(true);
        }

        if(ejecucion === 'eliminar') {
            // Valor a cobrar
            const msg = await valorPagar(placa)
            setAlerta({
                msg: msg,
                error: false
            })
            setMostrarAlerta(true)
            setCerrarAlerta(true);
            actualizarTable(placa);
            const response = await eliminarVehiculo(placa)
            if(response.error) {
                callAlert({
                    msg: 'Error al eliminar el vehiculo',
                    error: true
                })
            }
        }

        if(ejecucion === 'cerrarEdicion') {
            setMostrarEdicion(false)
        }
    }

    const actualizarTable = placa => {
        const nuevosVehiculos = vehiculosTable.filter(vehiculo => vehiculo.placa !== placa)
        setVehiculosTable(nuevosVehiculos);
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

    const formatearFecha = fecha => {
        const nuevaFecha = new Date(fecha)
        
        const options = {
            month: 'long',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
        }
        const formateoFecha = new Intl.DateTimeFormat('es-CO', options)

        const fechaActualizada = formateoFecha.format(nuevaFecha);
        return fechaActualizada;
    }

    const handleCerrarAlerta = () => {
        setMostrarAlerta(false);
        setCerrarAlerta(false);
    }

  return (
    <>
        {mostrarAlerta && <Alerta alerta={alerta} />}
        <div className='cerrarAlerta'>
            {cerrarAlerta && <button type='button' onClick={handleCerrarAlerta}>Cerrar</button>}
        </div>
        {/* {mostrarEdicion && < DivEdicion vehiculo={vehiculoEditar}/>} */}
        {mostrarEdicion && 
            <div className='cerrarEdicion'>
                <button
                    onClick={function() {
                        handleClick(null, 'cerrarEdicion')
                    }}
                >Cerrar Edicion</button>
            </div>
        }

        <div className="tabla">
            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Nombre propietario</th>
                        <th>Tipo de Vehiculo</th>
                        <th>Hora Entrada</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {vehiculosTable.map(vehiculo => {
                        return (
                            <tr key={vehiculo.placa}>
                                <td>{vehiculo.placa}</td>
                                <td>{vehiculo.nombrePropietario}</td>
                                <td>{vehiculo.tipoDeVehiculo}</td>
                                <td>{formatearFecha(vehiculo.horaEntrada)}</td>
                                <td><button className="button editar"
                                    onClick={function(){
                                        handleClick(vehiculo.placa, 'editar')
                                    }}
                                >Editar</button></td>
                                <td><button className="button eliminar"
                                    onClick={function(){
                                        handleClick(vehiculo.placa, 'eliminar')
                                    }}
                                >Eliminar</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        
    </>
  )
}

export default ListadoVehiculos