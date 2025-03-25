import './App.css'
import Hero from './components/myComponents/Landing/hero'
import Navbar from './components/myComponents/Landing/navbar'

function App() {

  return (
    <>
      <div className="w-full flex justify-center">
        <Navbar />
        <Hero />
      </div>
    </>
  )
}

export default App
