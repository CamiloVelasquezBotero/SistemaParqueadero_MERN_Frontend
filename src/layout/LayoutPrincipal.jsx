import { Outlet } from 'react-router-dom'

import Header from '../components/Header';
import Footer from '../components/Footer.jsx';

const LayoutPrincipal = () => {
  return (
    <>
        <header>
          <Header />
        </header>

        <main className='container'>
            <Outlet />
        </main>

        <footer>
          <Footer />
        </footer>
    </>
  )
}

export default LayoutPrincipal