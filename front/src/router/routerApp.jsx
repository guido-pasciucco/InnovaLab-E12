import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '../layout/layout';

export default function RouterApp() {
    return (
        <div>
            <Router>
                <Routes>
                    {/* Define your routes here */}
                    <Route path="/" element={<Layout />} >
                    
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}