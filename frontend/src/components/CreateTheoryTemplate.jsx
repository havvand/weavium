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

    // Dynamic lists for the template
    const [claims, setClaims] = useState(['']);
    const [evidence, setEvidence] = useState(['']);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const [createNode] = useMutation(CREATE_NODE);
    const [linkNodes] = useMutation(LINK_NODES, {
        refetchQueries: [{ query: GET_NODES_FULL }] // Refresh the UI when completely done
    });

    const handleDynamicChange = (setter, array, index, value) => {
        const newArray = [...array];
        newArray[index] = value;
        setter(newArray);
    };

    const addField = (setter, array) => setter([...array, '']);

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

            // 2. Process Core Claims (HYPOTHESIS) and link with PROPOSES
            const validClaims = claims.filter(c => c.trim() !== '');
            for (const claimTitle of validClaims) {
                const claimRes = await createNode({
                    variables: { title: claimTitle, type: 'HYPOTHESIS' }
                });
                await linkNodes({
                    variables: { sourceId: theoryId, targetId: claimRes.data.createNode.id, type: 'PROPOSES' }
                });
            }

            // 3. Process Initial Evidence (EVIDENCE) and link with EXPLORES
            const validEvidence = evidence.filter(e => e.trim() !== '');
            for (const evTitle of validEvidence) {
                const evRes = await createNode({
                    variables: { title: evTitle, type: 'EVIDENCE' }
                });
                await linkNodes({
                    variables: { sourceId: theoryId, targetId: evRes.data.createNode.id, type: 'EXPLORES' }
                });
            }

            // Reset Form on Success
            setTitle('');
            setDescription('');
            setClaims(['']);
            setEvidence(['']);
            alert("Theory successfully woven into the graph!");

        } catch (err) {
            console.error(err);
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', marginBottom: '10px' };
    const sectionStyle = { backgroundColor: '#f4f4f9', padding: '15px', borderRadius: '6px', marginBottom: '15px' };

    return (
        <div style={{ padding: '25px', border: '2px solid #2c3e50', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', backgroundColor: '#fff' }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>🧠 Initialize New Theory</h2>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                Define your overarching framework and map out the initial claims and evidence. The system will automatically build the graph structure.
            </p>

            <form onSubmit={handleSubmit}>
                {/* SECTION 1: The Anchor */}
                <div style={sectionStyle}>
                    <h4 style={{ margin: '0 0 10px 0' }}>1. The Framework</h4>
                    <input
                        type="text"
                        placeholder="Theory Name (e.g., A Unified Theory of Consciousness)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <textarea
                        placeholder="Abstract / High-level description..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        style={inputStyle}
                    />
                </div>

                {/* SECTION 2: Core Claims (PROPOSES) */}
                <div style={sectionStyle}>
                    <h4 style={{ margin: '0 0 10px 0' }}>2. Core Claims (Hypotheses)</h4>
                    <p style={{ fontSize: '0.8em', color: '#666', margin: '0 0 10px 0' }}>What are the main arguments this theory proposes?</p>
                    {claims.map((claim, idx) => (
                        <input
                            key={idx}
                            type="text"
                            placeholder={`Claim #${idx + 1}`}
                            value={claim}
                            onChange={e => handleDynamicChange(setClaims, claims, idx, e.target.value)}
                            style={inputStyle}
                        />
                    ))}
                    <button type="button" onClick={() => addField(setClaims, claims)} style={{ fontSize: '0.8em', padding: '5px 10px', cursor: 'pointer' }}>
                        + Add Another Claim
                    </button>
                </div>

                {/* SECTION 3: Initial Evidence (EXPLORES) */}
                <div style={sectionStyle}>
                    <h4 style={{ margin: '0 0 10px 0' }}>3. Initial Evidence / Foundation</h4>
                    <p style={{ fontSize: '0.8em', color: '#666', margin: '0 0 10px 0' }}>What empirical facts or observations are you exploring to build this?</p>
                    {evidence.map((ev, idx) => (
                        <input
                            key={idx}
                            type="text"
                            placeholder={`Evidence #${idx + 1} (e.g., Cells respond to mechanical vibration)`}
                            value={ev}
                            onChange={e => handleDynamicChange(setEvidence, evidence, idx, e.target.value)}
                            style={inputStyle}
                        />
                    ))}
                    <button type="button" onClick={() => addField(setEvidence, evidence)} style={{ fontSize: '0.8em', padding: '5px 10px', cursor: 'pointer' }}>
                        + Add Initial Evidence
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '15px', fontSize: '1.1em', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    {isSubmitting ? 'Architecting Theory...' : 'Establish Framework'}
                </button>

                {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>Error: {errorMsg}</p>}
            </form>
        </div>
    );
}