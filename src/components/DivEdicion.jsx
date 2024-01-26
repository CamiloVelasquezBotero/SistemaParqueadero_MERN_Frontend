/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import useVehiculos from "../hooks/useVehiculos";
import clienteAxios from "../config/axios"
import Alerta from '../components/Alerta.jsx';

const DivEdicion = ({vehiculo}) => {
    const [placa, setPlaca] = useState(vehiculo.placa)
    const [nombrePropietario, setNombrePropietario] = useState(vehiculo.nombrePropietario)
    const [tipoDeVehiculo, setTipoDeVehiculo] = useState(vehiculo.tipoDeVehiculo)

    const [alerta, setAlerta] = useState({});
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const { 
        getVehiculos,
        setVehiculosTable, 
        setMostrarEdicionContext,
        setSearch,
        vehiculoEditar
    } = useVehiculos();

    useEffect(() => {
        const inicializarValue = () => {
            setPlaca(vehiculoEditar.placa)
            setNombrePropietario(vehiculoEditar.nombrePropietario)
            setTipoDeVehiculo(vehiculoEditar.tipoDeVehiculo)
        }
        inicializarValue();
    }, [vehiculoEditar])

    const handleSubmit = async e => {
        e.preventDefault();

        // Comprobar Campos
        if(!comprobarCampos()){
            return
        }

        const vehiculoActualizado = {
            placa,
            nombrePropietario,
            tipoDeVehiculo
        }
        try {
            const {data} = await clienteAxios.put(`/parqueadero/${vehiculoEditar.placa}`, vehiculoActualizado)
            callAlert({
                msg: data.msg,
                error: data.error
            })
            if(data.error) {
                return callAlert({
                    msg: data.msg,
                    error: data.error
                })
            }
            if(!data.error) {
                setSearch('');
            }
            actualizarTable();
            setMostrarEdicionContext(false)
        } catch (error) {
            console.log(error);
        }
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

    const actualizarTable = async () => {
            const datos = await getVehiculos();
    
            const existeAlerta = datos.msg;
            if(existeAlerta) {
                return callAlert({
                    msg: datos.msg,
                    error: datos.error
                }) 
            }
            // Le mando los vehiculos
            setVehiculosTable(datos);
    }
    
  return (

        <>
            {mostrarAlerta && <Alerta alerta={alerta} />}
            <div className="edicion">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="placa">Placa: </label>
                    <input type="text" placeholder="Placa" id="placa"
                        value={placa || ''}
                        onChange={e => setPlaca(e.target.value.toUpperCase())}
                    />
                    <label htmlFor="propietario">Propietario: </label>
                    <input type="text" placeholder="Propietario" id="propietario"
                        value={nombrePropietario || ''}
                        onChange={e => setNombrePropietario(e.target.value)}
                    />
                    <div className="inputRadio">
                        <label htmlFor="motocicleta" className='labelMotocicleta'>Motocicleta</label>
                        <input type="radio" name='tipoDeVehiculo' value='Motocicleta' id='motocicleta'
                        onClick={e => setTipoDeVehiculo(e.target.value)}
                        />
                        <label htmlFor="automovil" className='labelAutomovil'>Automovil</label>
                        <input type="radio" name='tipoDeVehiculo' value='Automovil' id='automovil'
                        onClick={e => setTipoDeVehiculo(e.target.value)}
                        />
                    </div>
                    
                    <input type="submit" value='Guardar Cambios'/>
                </form>
            </div>
        </>
  )
}

export default DivEdicion