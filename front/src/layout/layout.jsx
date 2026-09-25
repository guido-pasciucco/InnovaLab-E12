import {Outlet} from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function Layout() {
    return (
        <div >
            <Navbar />
            <main >
                {/* Your main content goes here */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}