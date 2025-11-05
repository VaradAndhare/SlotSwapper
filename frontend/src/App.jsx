import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Swap from "./pages/Swap"
import Navbar from "./components/Navbar";
import SwapMarketplace from "./pages/SwapMarketplace";
import SwapRequests from "./pages/SwapRequests";
//import './App.css'

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/swap" element={<SwapMarketplace />} />
        <Route path="/requests" element={<SwapRequests/>}/>
      </Routes>
    </Router>
  )
}

export default App
