import {Outlet} from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Header from '../components/header';

export default function Layout() {
    return (
        <div >
            <Header />
            <Navbar />
            <main >
                {/* Your main content goes here */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}