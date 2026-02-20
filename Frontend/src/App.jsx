import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Components/Home/HomePage'
import HomePage from './Components/Home/HomePage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
