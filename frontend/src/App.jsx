import { useState } from 'react'
import './App.css'
import { WeaveNodeList } from './components/WeaveNodeList'
import { CreateNodeForm } from './components/CreateNodeForm'
import { LinkNodesForm } from './components/LinkNodesForm'
//import { CreateTheoryTemplate } from './components/CreateTheoryTemplate'
import { WeaveGraph } from './components/WeaveGraph'
import {CreateTheoryTemplate} from "./components/CreateTheoryTemplate.jsx";

function App() {
    const [view, setView] = useState('GRAPH'); // Default to the cool new view

    const tabStyle = (isActive) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#2c3e50' : '#eee',
        color: isActive ? 'white' : '#333',
        border: 'none',
        borderRadius: '4px 4px 0 0',
        marginRight: '5px',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <div className="app-container">
            <h1>Weavium</h1>
            <p style={{ color: '#888' }}>The Architecture of Thought</p>

            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', borderBottom: '2px solid #2c3e50', marginBottom: '20px' }}>
                    <button style={tabStyle(view === 'GRAPH')} onClick={() => setView('GRAPH')}>
                        🕸️ Visual Graph
                    </button>
                    <button style={tabStyle(view === 'QUICK')} onClick={() => setView('QUICK')}>
                        ⚡ Quick Capture
                    </button>
                    <button style={tabStyle(view === 'THEORY')} onClick={() => setView('THEORY')}>
                        🏛️ Initialize Theory
                    </button>
                </div>

                {/* View Routing */}
                {view === 'GRAPH' && <WeaveGraph />}

                {view === 'QUICK' && (
                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', maxWidth: '800px', margin: '0 auto' }}>
                        <CreateNodeForm />
                        <LinkNodesForm />
                    </div>
                )}

                {view === 'THEORY' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <CreateTheoryTemplate />
                    </div>
                )}

                <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />

                {/* The List is a good fallback reference */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <WeaveNodeList />
                </div>

            </div>
        </div>
    )
}

export default App