import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const CREATE_NODE = gql`
    mutation CreateNode($title: String!, $type: NodeType!, $description: String) {
        createNode(title: $title, type: $type, description: $description) {
            id
        }
    }
`;

const LINK_NODES = gql`
    mutation LinkNodes($sourceId: ID!, $targetId: ID!, $type: RelationshipType!) {
        linkNodes(sourceId: $sourceId, targetId: $targetId, type: $type) {
            id
        }
    }
`;

const GET_NODES_FULL = gql`
    query GetNodes {
        nodes {
            id
            title
            type
            description
            links {
                type
                target {
                    id
                    title
                }
            }
        }
    }
`;

export function CreateTheoryTemplate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // NEW: Nested State. Each claim has its own array of evidence.
    const [claims, setClaims] = useState([
        { title: '', evidence: [''] }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const [createNode] = useMutation(CREATE_NODE);
    const [linkNodes] = useMutation(LINK_NODES, {
        refetchQueries: [{ query: GET_NODES_FULL }]
    });

    // --- State Handlers ---
    const handleClaimChange = (index, value) => {
        const newClaims = [...claims];
        newClaims[index].title = value;
        setClaims(newClaims);
    };

    const handleEvidenceChange = (claimIndex, evIndex, value) => {
        const newClaims = [...claims];
        newClaims[claimIndex].evidence[evIndex] = value;
        setClaims(newClaims);
    };

    const addClaim = () => setClaims([...claims, { title: '', evidence: [''] }]);

    const addEvidence = (claimIndex) => {
        const newClaims = [...claims];
        newClaims[claimIndex].evidence.push('');
        setClaims(newClaims);
    };

    // --- Submission Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            // 1. Create the Anchor Node (THEORY)
            const theoryRes = await createNode({
                variables: { title, type: 'THEORY', description }
            });
            const theoryId = theoryRes.data.createNode.id;

            // 2. Loop through each Claim
            for (const claim of claims) {
                if (!claim.title.trim()) continue;

                // Create HYPOTHESIS
                const claimRes = await createNode({
                    variables: { title: claim.title, type: 'HYPOTHESIS' }
                });
                const claimId = claimRes.data.createNode.id;

                // Link THEORY -> PROPOSES -> HYPOTHESIS
                await linkNodes({
                    variables: { sourceId: theoryId, targetId: claimId, type: 'PROPOSES' }
                });

                // 3. Loop through the Evidence for THIS specific Claim
                for (const evTitle of claim.evidence) {
                    if (!evTitle.trim()) continue;

                    // Create EVIDENCE
                    const evRes = await createNode({
                        variables: { title: evTitle, type: 'EVIDENCE' }
                    });
                    const evId = evRes.data.createNode.id;

                    // Link HYPOTHESIS <- SUPPORTS - EVIDENCE (Notice the target is the claim, not the theory)
                    await linkNodes({
                        variables: { sourceId: evId, targetId: claimId, type: 'SUPPORTS' }
                    });
                }
            }

            // Reset Form on Success
            setTitle('');
            setDescription('');
            setClaims([{ title: '', evidence: [''] }]);
            alert("Theory successfully woven into the graph!");

        } catch (err) {
            console.error(err);
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- UI Styles ---
    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', marginBottom: '10px', boxSizing: 'border-box' };
    const sectionStyle = { backgroundColor: '#f4f4f9', padding: '15px', borderRadius: '6px', marginBottom: '15px', borderLeft: '4px solid #2c3e50' };
    const evidenceStyle = { backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', marginLeft: '20px', marginBottom: '10px', borderLeft: '3px solid #4CAF50' };

    return (
        <div style={{ padding: '25px', border: '2px solid #2c3e50', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', backgroundColor: '#fff', color: '#333' }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>🧠 Initialize New Theory</h2>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                Define your overarching framework and map out the specific evidence supporting each of your core claims.
            </p>

            <form onSubmit={handleSubmit}>
                {/* SECTION 1: The Anchor */}
                <div style={sectionStyle}>
                    <h4 style={{ margin: '0 0 10px 0' }}>1. The Framework</h4>
                    <input
                        type="text" placeholder="Theory Name (e.g., A Unified Theory of Consciousness)"
                        value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle}
                    />
                    <textarea
                        placeholder="Abstract / High-level description..."
                        value={description} onChange={e => setDescription(e.target.value)} rows={3} style={inputStyle}
                    />
                </div>

                {/* SECTION 2: Nested Claims & Evidence */}
                <div style={{...sectionStyle, backgroundColor: '#eceff1', borderLeft: '4px solid #9C27B0'}}>
                    <h4 style={{ margin: '0 0 10px 0' }}>2. Core Claims & Evidence</h4>

                    {claims.map((claim, claimIdx) => (
                        <div key={claimIdx} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #ccc' }}>

                            {/* Claim Input */}
                            <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#9C27B0' }}>Hypothesis #{claimIdx + 1}</label>
                            <input
                                type="text" placeholder="What is the claim?"
                                value={claim.title} onChange={e => handleClaimChange(claimIdx, e.target.value)} style={inputStyle}
                            />

                            {/* Nested Evidence Inputs */}
                            <div style={evidenceStyle}>
                                <label style={{ fontSize: '0.8em', fontWeight: 'bold', color: '#4CAF50' }}>Supporting Evidence</label>
                                {claim.evidence.map((ev, evIdx) => (
                                    <input
                                        key={evIdx} type="text" placeholder={`Evidence / Fact #${evIdx + 1}`}
                                        value={ev} onChange={e => handleEvidenceChange(claimIdx, evIdx, e.target.value)} style={{...inputStyle, marginTop: '5px', marginBottom: '5px'}}
                                    />
                                ))}
                                <button type="button" onClick={() => addEvidence(claimIdx)} style={{ fontSize: '0.8em', padding: '5px 10px', cursor: 'pointer', background: 'none', border: '1px solid #4CAF50', color: '#4CAF50', borderRadius: '4px' }}>
                                    + Add Evidence for this Hypothesis
                                </button>
                            </div>

                        </div>
                    ))}

                    <button type="button" onClick={addClaim} style={{ fontSize: '0.9em', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px' }}>
                        + Add Another Hypothesis
                    </button>
                </div>

                <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', fontSize: '1.1em', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    {isSubmitting ? 'Architecting Theory...' : 'Establish Framework'}
                </button>

                {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>Error: {errorMsg}</p>}
            </form>
        </div>
    );
}