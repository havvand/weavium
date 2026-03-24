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
import { AuthModal } from './components/AuthModalUI.jsx'

import WeaviumLandingLogo from "./assets/WeaviumLandingLogo.png";
import {Sidebar} from "./components/utility/Sidebar.jsx";

function App() {
    // Using LANDINGHERO as the default view based on your custom snippet
    const [view, setView] = useState('LANDINGHERO');
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#363434' }}>
            <Navbar currentView={view} setView={setView} onOpenAuth={() => setShowAuthModal(true)} />

            {/* Main Content Container */}
            <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%', flex: 1, backgroundColor: '#262424', textAlign: 'center' }}>

                {/* Using HOME or LANDINGHERO to catch both the default state and the Navbar clicks */}
                {(view === 'LANDINGHERO' || view === 'HOME') && (
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <LandingHero setView={setView} />

                    </div>
                )}

                {view === 'GRAPH' && (
                    <div style={{ padding: '1px' }}>
                        <h2 className={'w_font'} style={{ fontSize: '1.5em', color: '#FFD700', margin: '5px', textAlign: 'center' }}>The Weave</h2>
                        <WeaveGraph />
                    </div>
                )}

                {view === 'QUICK' && (
                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
                        <CreateNodeForm />
                        <LinkNodesForm />
                        <hr style={{ margin: '40px 0', border: '1px solid #444' }} />
                        <WeaveNodeList />
                    </div>
                )}

                {view === 'THEORY' && (
                    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
                        <CreateTheoryTemplate />
                    </div>
                )}

            </div>

            {/* Overlay the Auth Modal if active */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    )
}

export default App