export function Navbar({currentView, setView}) {
    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2d2d2d',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    }

    const logoStyle = {
        fontSize: '1.5em',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const buttonStyle = (isActive) => ({
        background: 'none',
        border: 'none',
        color: isActive ? '#FFD700' : 'white',
        fontSize: '1em',
        cursor: 'pointer',
        padding: '8px 15px',
        borderBottom: isActive ? '2px solid #FFD700' : '2px solid transparent',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <nav style={navStyle}>
            <div style={logoStyle} onClick={() => setView('HOME')}>
                🕸️ weavium
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button style={buttonStyle(currentView === 'GRAPH')} onClick={() => setView('GRAPH')}>
                    Visual Graph
                </button>
                <button style={buttonStyle(currentView === 'THEORY')} onClick={() => setView('THEORY')}>
                    Initialize Theory
                </button>
                <button style={buttonStyle(currentView === 'QUICK')} onClick={() => setView('QUICK')}>
                    Quick Capture
                </button>
            </div>
        </nav>
    );
}