import { useContext } from 'react';
import VehiculosContext from '../context/VehiculosProvider'

const useVehiculos = () => {
    return useContext(VehiculosContext);
}

export default useVehiculos;