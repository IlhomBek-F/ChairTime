import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Button variant="default" >Hello world</Button>
    </>
  )
}

export default App
