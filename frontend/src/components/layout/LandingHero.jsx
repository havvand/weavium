import WeaviumLandingLogo from "../../assets/WeaviumLandingLogo.png";

export function LandingHero({ setView }) {
    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%', flex: 1, backgroundColor: '#262424'}}>
            <img
                src = {WeaviumLandingLogo} alt=""

                style={{ alignSelf: 'center', width: '100%', height: '100%', maxWidth: 900, maxHeight: 900, }}
            />

            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}></h2>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#bdccd3',
            borderRadius: '12px',
            marginTop: '40px',
            border: '1px solid #e9ecef'
        }}>
            <h1 style={{ fontSize: '3.5em', color: '#2f2f31', marginBottom: '10px' }}>
                The Architecture of Thought
            </h1>
            <p style={{ fontSize: '1.2em', color: '#6c757d', maxWidth: '600px', lineHeight: '1.6', marginBottom: '40px' }}>
                Weavium is a semantic research engine. Map out complex ideas, visualize logical dependencies, and build living intellectual frameworks.
            </p>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={() => setView('THEORY')}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.1em',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                    🏛️ Build a Framework
                </button>

                <button
                    onClick={() => setView('GRAPH')}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.1em',
                        backgroundColor: '#fff',
                        color: '#2c3e50',
                        border: '2px solid #2c3e50',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                    🕸️ Explore the Graph
                </button>
            </div>

            <div style={{ marginTop: '60px', display: 'flex', gap: '40px', color: '#495057', textAlign: 'left', maxWidth: '100%' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ borderBottom: '2px solid #FFD700', display: 'inline-block', paddingBottom: '5px' }}>1. Anchor</h3>
                    <p style={{ fontSize: '0.9em' }}>Define your core Theory or Framework to establish a gravitational center for your thoughts.</p>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ borderBottom: '2px solid #4CAF50', display: 'inline-block', paddingBottom: '5px' }}>2. Propose</h3>
                    <p style={{ fontSize: '0.9em' }}>Formulate strict hypotheses and map out the axioms and derivations that logically support them.</p>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ borderBottom: '2px solid #2196F3', display: 'inline-block', paddingBottom: '5px' }}>3. Explore</h3>
                    <p style={{ fontSize: '0.9em' }}>Attach evidence, citations, and metaphors to create a rich, navigable web of knowledge.</p>
                </div>
            </div>
        </div>
        </div>
    );
}