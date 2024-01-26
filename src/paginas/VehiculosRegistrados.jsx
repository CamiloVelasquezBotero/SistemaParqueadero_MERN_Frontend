/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useVehiculos from '../hooks/useVehiculos';
import ListadoVehiculos from '../components/ListadoVehiculos';
import Alerta from '../components/Alerta.jsx'
import DivEdicion from '../components/DivEdicion';

const VehiculosRegistrados = () => {
    const [alerta, setAlerta] = useState({});
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [buttonTextMotos, setButtonTextMotos] = useState('Motos');
    const [buttonTextCarros, setButtonTextCarros] = useState('Autos');
    
    const { 
        getVehiculos,
        vehiculos, setVehiculos,
        vehiculosTable ,setVehiculosTable,
        vehiculoEditar, setVehiculoEditar,
        getVehiculo,
        mostrarEdicionContext, setMostrarEdicionContext,
        search, setSearch
    } = useVehiculos();

    useEffect(() => {
        const obtenerVehiculos = async () => {
            const datos = await getVehiculos();
    
            const existeAlerta = datos.msg;
            if(existeAlerta) {
                return callAlert({
                    msg: datos.msg,
                    error: datos.error
                }) 
            }
            // Le mando los vehiculos
            setVehiculos(datos);
            setVehiculosTable(datos);
        }
        obtenerVehiculos();
    },[])

    const handleClick = async () => {
        const valuePlaca = document.querySelector('.inputSearch').value;
        if(valuePlaca === ''){
            return callAlert({
                msg: 'El campo esta vacio',
                error: true
            })
        }
        if(valuePlaca.length < 6 || valuePlaca.length > 6) {
            return callAlert({
              msg: 'La Placa debe tener 6 Caracteres',
              error: true
            })
        }
        
        const datos =  await getVehiculo(valuePlaca);
        const existeMensaje = datos.msg;
        if(existeMensaje) {
            callAlert({
                msg: datos.msg,
                error: true
            })
            return;
        }
        setMostrarEdicionContext(true);
        setVehiculoEditar(datos);
    }

    const handleFiltrar = (ejecucion) => {
        // Motocicletas
        if(ejecucion === 'motos') {
            const motocicletas = vehiculos.filter(vehiculo => vehiculo.tipoDeVehiculo === 'Motocicleta');
            setVehiculosTable(motocicletas);
            setButtonTextMotos('X');
            setButtonTextCarros('Autos');

            // Restablecer filtros
            if(buttonTextMotos === 'X') {
                setVehiculosTable(vehiculos);
                setButtonTextMotos('Motos');
            }
        }

        // Automoviles
        if(ejecucion === 'carros') {
            const automoviles = vehiculos.filter(vehiculo => vehiculo.tipoDeVehiculo === 'Automovil');
            setVehiculosTable(automoviles);
            setButtonTextCarros('X');
            setButtonTextMotos('Motos');

            // Restablecer filtros
            if(buttonTextCarros === 'X') {
                setVehiculosTable(vehiculos);
                setButtonTextCarros('Autos');
            }
        }

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

    const handleClose = () => {
        setMostrarEdicionContext(false);
    }

    return (
        <section className="vehiculosRegistrados">
            <nav className="row navigation">
                <div className="col-2 returnBack">
                    <Link to='/' className='btnBack'>Volver</Link>
                </div>
                <div className="col-5 search">
                    <p>Buscar:</p>
                    <input type="text" placeholder='Placa' className='inputSearch'
                        value={search}
                        onChange={e => setSearch(e.target.value.toUpperCase())}
                    />
                    <button type='button' onClick={handleClick}>Buscar</button>
                </div>
                <div className="col-5 filter">
                    <p>Filtrar por:</p>
                    <button type='button' 
                        onClick={function() {
                            handleFiltrar('motos')
                        }}
                    >{buttonTextMotos}</button>
                    <button type='button' 
                        onClick={function() {
                            handleFiltrar('carros')
                        }}
                    >{buttonTextCarros}</button>
                </div>
            </nav>

            <hr />
            
            
            <div className='list'>
                {mostrarAlerta && <Alerta alerta={alerta}/>}
                <h2 className='tittleList'>{vehiculos.length > 0 ? 'Vehiculos Registrados:' : 'No hay Vehiculos Registrados'}</h2>
                {mostrarEdicionContext && < DivEdicion vehiculo={vehiculoEditar}/>}
                {mostrarEdicionContext && 
                    <div className='cerrarEdicion'>
                        <button
                            onClick={handleClose}
                        >Cerrar Edicion</button>
                    </div>
                }
                <div className='listadoVehiculos'>
                    {vehiculos.length > 0 && <ListadoVehiculos />}
                </div>
            </div>
        </section>
    )
}

export default VehiculosRegistrados