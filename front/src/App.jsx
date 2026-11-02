import './App.css'
import RouterApp from './router/routerApp'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <RouterApp />
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}

export default App
