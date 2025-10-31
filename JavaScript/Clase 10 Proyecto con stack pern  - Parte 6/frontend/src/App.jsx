import {Router, Route, Routes} from "react-router-dom"
import React from "react"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import LoginPages from "./pages/LoginPages"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import TareasPage from "./pages/TareasPage"
import TraeasFromPage from "./pages/TareasFromPage"
import NotFound from "./pages/NotFound"



function App() {
  return (
    <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route pahth="/about" element={<AboutPage/>}/>
    <Route path="/Login" element={<LoginPages/>}/>
    <Route path="/register" element={<RegisterPage/>}/>

    <Route path="/perfil" element={<ProfilePage/>}/>
    <Route path="/tareas" element={<TareasPage/>}/>
    <Route path="/tareas/crear" element={<TraeasFromPage/>}/>
     <Route path="/tareas/editar/:id" element={<TraeasFromPage/>}/>
     <Route path="*" element={<NotFound/>} />




    
    </Routes>
  
  )
}

export default App
