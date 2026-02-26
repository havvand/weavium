import { useState } from 'react';
import './App.css';
// Layout
import { Navbar } from "./components/layout/NavBar.jsx";
import { LandingHero } from "./components/layout/LandingHero.jsx";

// Features
import { WeaveNodeList } from './components/WeaveNodeList';
import { CreateNodeForm } from './components/CreateNodeForm';
import { LinkNodesForm } from './components/LinkNodesForm';
import { WeaveGraph } from './components/WeaveGraph';
import { CreateTheoryTemplate } from "./components/CreateTheoryTemplate.jsx";

import WeaviumLandingLogo from "./assets/WeaviumLandingLogo.png";

function App() {
    const [view, setView] = useState('HOME'); // Default to Home view


    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#363434' }}>
            <Navbar currentView={view} setView={setView} />

            {/* Main Content Container */}
            <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%', flex: 1, backgroundColor: '#262424'}}>
                {view === 'HOME' && (
                    <div style={{ marginTop: '20px'}}>
                        <LandingHero />
                    </div>
                )}
                {/*View Routing*/}
                {view === 'GRAPH' && (
                    <div style={{ marginTop: '20px' }}>
                        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>The Weave</h2>
                        <WeaveGraph />
                    </div>
                )}

                {view === 'QUICK' && (
                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', maxWidth: '800px', margin: '40px auto' }}>
                        <CreateNodeForm />
                        <LinkNodesForm />
                        <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />
                        <WeaveNodeList />
                    </div>
                )}

                {view === 'THEORY' && (
                    <div style={{ maxWidth: '800px', margin: '40px auto' }}>
                        <CreateTheoryTemplate />
                    </div>
                )}


            </div>

        </div>
        )
}

export default App