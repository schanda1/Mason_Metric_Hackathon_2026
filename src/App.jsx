import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button, Card, Badge, CardHeader, CardTitle, CardContent} from "@/components/ui"


function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="p-10"
           <Card className="w-[350px]">
               <CardHeader>
                   <CardTitle>Course Number</CardTitle>
               </CardHeader>
               <CardContent className = "sapce-y-4">
                   <Input type= "text" placeholder = "Course Number" />
                   <Button className="w-full">Enter</Button>
               </CardContent>
           </Card>
      <div>

        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="text-blue-500 underline">Testing Tailwind</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
