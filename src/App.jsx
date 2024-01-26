import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LayoutPrincipal from './layout/LayoutPrincipal.jsx';
import Main from './paginas/Main.jsx';
import VehiculosRegistrados from './paginas/VehiculosRegistrados.jsx';

import { VehiculosProvider } from './context/VehiculosProvider.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <VehiculosProvider>
          <Routes>s
            <Route path='/' element={<LayoutPrincipal />}>
              <Route  index element={<Main />} />
              <Route path='/vehiculosRegistrados' element={<VehiculosRegistrados />} />
            </Route>
          </Routes>
        </VehiculosProvider>
      </BrowserRouter>
    </>
  )
}

export default App
