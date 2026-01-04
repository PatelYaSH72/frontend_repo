import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Navbar from './components/Navbar'
import Footer from './pages/Footer'
import Appointment from './pages/Appointment'
 import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
     <Navbar/>
     <Routes>
     <Route path="/" element={ <Home/> }/>
     <Route path="/doctors" element={ <Doctors/> }/>
     <Route path="/doctors/:speciality" element={ <Doctors/> }/>
     <Route path="/login" element={ <Login/> }/>
     <Route path="/About" element={ <About/> }/>
     <Route path="/Contact" element={ <Contact/> }/>
     <Route path="/my-profile" element={ <MyProfile/> }/>
     <Route path="/my-appointments" element={ <MyAppointments/> }/>
     <Route path="/appointment/:docID" element={ <Appointment/> }/>
     </Routes>
     <Footer/>
    </div>
  )
}

export default App