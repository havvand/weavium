import WeaviumWLogoV1 from "../../assets/WeaviumWLogoV1.svg";
import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar({ currentView, setView, onOpenAuth }) {
    const { user, logout } = useAuth();

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        color: 'white',
        //boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #c7efef',
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
        color: isActive ? '#c7efef' : 'white',
        fontSize: '1em',
        cursor: 'pointer',
        padding: '8px 15px',
        borderBottom: isActive ? '2px solid #c7efef' : '2px solid transparent',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <nav style={navStyle}>
            <div style={logoStyle} onClick={() => setView('HOME')}>
                <img src={WeaviumWLogoV1}
                     height={'25px'}

                />
                <h1 className={'w_font'} style={{ margin: '0px'}}> weavium </h1 >
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <button style={buttonStyle(currentView === 'GRAPH')} onClick={() => setView('GRAPH')}>
                    Visual Graph
                </button>
                <button style={buttonStyle(currentView === 'THEORY')} onClick={() => setView('THEORY')}>
                    Initialize Theory
                </button>
                <button style={buttonStyle(currentView === 'QUICK')} onClick={() => setView('QUICK')}>
                    Quick Capture
                </button>

                {/* --- NEW: Auth UI Section --- */}
                <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 10px' }}></div>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#aaa', fontSize: '0.9em' }}>
              Hi, <strong style={{color: '#fff'}}>{user.username}</strong>
            </span>
                        <button
                            onClick={logout}
                            style={{ ...buttonStyle(false), color: '#ff8a80', fontSize: '0.9em', padding: '5px 10px' }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        style={{ ...buttonStyle(false), backgroundColor: '#7c9f9d', borderRadius: '4px', padding: '8px 15px', color: 'white' }}
                    >
                        Login / Register
                    </button>
                )}
            </div>
        </nav>
    );
}