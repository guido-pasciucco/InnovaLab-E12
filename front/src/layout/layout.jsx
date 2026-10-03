import {Outlet} from 'react-router-dom'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar';


export default function Layout() {
    return (
        <div >
            <Navbar />
            <Sidebar />
            <main >
                {/* Your main content goes here */}
                <Outlet />
            </main>
        </div>
    );
}