import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function AuthModal({ onClose }) {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        let result;
        if (isLogin) {
            result = await login(username, password);
        } else {
            result = await register(username, email, password);
        }

        setIsSubmitting(false);

        if (result.success) {
            onClose(); // Close the modal on success
        } else {
            setErrorMsg(result.error);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '4px',
        border: '1px solid #555', backgroundColor: '#262424', color: '#fff', boxSizing: 'border-box'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#363434', padding: '30px', borderRadius: '8px',
                width: '100%', maxWidth: '400px', border: '1px solid #555', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'left'
            }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#FFD700', margin: 0 }}>{isLogin ? 'Welcome Back' : 'Join Weavium'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.2em', cursor: 'pointer' }}>✕</button>
                </div>

                {errorMsg && (
                    <div style={{ padding: '10px', backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #ff8a80', borderRadius: '4px', color: '#ff8a80', marginBottom: '15px', fontSize: '0.9em' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: '0.85em', color: '#aaa', marginBottom: '5px', display: 'block' }}>Username</label>
                    <input
                        type="text" value={username} onChange={e => setUsername(e.target.value)}
                        required style={inputStyle} placeholder="E.g., Soseki"
                    />

                    {!isLogin && (
                        <>
                            <label style={{ fontSize: '0.85em', color: '#aaa', marginBottom: '5px', display: 'block' }}>Email</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required style={inputStyle} placeholder="you@example.com"
                            />
                        </>
                    )}

                    <label style={{ fontSize: '0.85em', color: '#aaa', marginBottom: '5px', display: 'block' }}>Password</label>
                    <input
                        type="password" value={password} onChange={e => setPassword(e.target.value)}
                        required style={inputStyle} placeholder="••••••••"
                    />

                    <button type="submit" disabled={isSubmitting} style={{
                        width: '100%', padding: '12px', backgroundColor: '#4CAF50', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', marginTop: '10px'
                    }}>
                        {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em', color: '#aaa' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                        style={{ color: '#2196F3', cursor: 'pointer', textDecoration: 'underline' }}
                    >
            {isLogin ? "Register here" : "Login here"}
          </span>
                </div>

            </div>
        </div>
    );
}