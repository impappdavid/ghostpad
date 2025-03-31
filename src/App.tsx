import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/myComponents/Landing/hero'
import Navbar from './components/myComponents/Landing/navbar'
import Articles from './articles/Articles'
import SignIn from './components/myComponents/signin/form'
import SignUp from './components/myComponents/signup/signupForm'
import Home from './home/Home'

// Layout component that includes Navbar
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that need Navbar */}
        <Route path="/" element={
          <Layout>
            <Hero />
          </Layout>
        } />
        <Route path="/articles" element={
          <Layout>
            <Articles />
          </Layout>
        } />
        
        {/* Route without Navbar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
