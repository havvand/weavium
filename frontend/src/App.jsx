import { useState } from 'react'
import './App.css'
import { WeaveNodeList } from './components/WeaveNodeList'

function App() {
    return (
        <>
            <h1>Weavium</h1>
            <div className="card">
                <WeaveNodeList />
            </div>
        </>
    )
}

export default App
