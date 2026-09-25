import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '../layout/layout';

import Home from '../components/home';
import About from '../components/about';

export default function RouterApp() {
    return (
        <div>
            <Router>
                <Routes>
                    {/* Define your routes here */}
                    <Route path="/" element={<Layout />} >
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}