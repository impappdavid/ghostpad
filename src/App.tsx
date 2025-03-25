import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/myComponents/Landing/hero'
import Navbar from './components/myComponents/Landing/navbar'
import Articles from './articles/Articles'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </Router>
  )
}

export default App
