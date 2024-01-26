import { useState, createContext } from  'react';
import clienteAxios from '../config/axios'

const VehiculosContext = createContext();

// eslint-disable-next-line react/prop-types
export const VehiculosProvider = ({children}) => {
  const [vehiculos, setVehiculos] = useState({});
  const [vehiculosTable, setVehiculosTable] = useState({});
  const [vehiculoEditar, setVehiculoEditar] = useState({});
  const [mostrarEdicionContext, setMostrarEdicionContext] = useState(false);
  const [search, setSearch] = useState('');

  const registrarVehiculo = async vehiculo => {
    try {
      const {data} = await clienteAxios.post('/parqueadero', vehiculo);
      return data
    } catch (error) {
      console.log(error);
    }
  }

  const eliminarVehiculo = async placa => {
    try {
      const {data} = await clienteAxios.delete(`/parqueadero/${placa}`);
      return data
    } catch (error) {
      console.log(error);
    }
  }

  const getVehiculos = async () => {
    const {data} = await clienteAxios('/parqueadero')
    return data
  }
  
  const getVehiculo = async placa => {
    try {
      const {data} = await clienteAxios(`/parqueadero/${placa}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const valorPagar = async placa => {
    const vehiculo = await getVehiculo(placa)

    const horaEntrada = new Date(vehiculo.horaEntrada).getHours();
    const horaSalida = new Date().getHours;

    let total = horaSalida - horaEntrada;
    if(isNaN(total)) {
      return 'No debe horas';
    }
    // Cobrar  motocicleta
    if(vehiculo.tipoDeVehiculo === 'Motocicleta') {
      total *= 1;
    }
    // Cobrar  Autos
    if(vehiculo.tipoDeVehiculo === 'Automovil') {
      total *= 3;
    }
    return (
      `Valor a Cancelar: ${total} `
    )
    
  }

  return (
    <VehiculosContext.Provider
      value={{
        registrarVehiculo,
        eliminarVehiculo,
        getVehiculos,
        getVehiculo,
        vehiculos,
        setVehiculos,
        vehiculoEditar,
        setVehiculoEditar,
        mostrarEdicionContext,
        setMostrarEdicionContext,
        search, setSearch,
        valorPagar,
        vehiculosTable,
        setVehiculosTable
      }}
    >
      {children}
    </VehiculosContext.Provider>
  )
}

export default VehiculosContext