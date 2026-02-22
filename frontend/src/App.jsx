import { useState } from 'react'
import './App.css'
import { WeaveNodeList } from './components/WeaveNodeList'
import {LinkNodesForm} from "./components/LinkNodesForm.jsx";
import {CreateNodeForm} from "./components/CreateNodeForm.jsx";

function App() {
    return (
        <>
            <h1>Weavium</h1>
            <div className="card">
                <LinkNodesForm />
                <CreateNodeForm />
                <WeaveNodeList />
            </div>
        </>
    )
}

export default App
