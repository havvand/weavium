import { useState } from 'react';
import { useMutation } from "@apollo/client/react";
import { gql } from '@apollo/client'

// Define Mutation
const CREATE_NODE = gql`
    mutation CreateNode($title: String!, $type: NodeType!, $description: String){
        createNode(title: $title, type: $type, description: $description) {
            id
            title
            description
            type
        }
    }
`;

// Define the Query so the list is updated after creation
const GET_NODES = gql`
    query GetNodes {
        nodes {
            id
            title
            type
            description
        }
    }
`;

export function CreateNodeForm() {
    const [formData, setFormData] = useState({
        title: '',
        type: 'AXIOM', // Default value
        description: ''
        }
    );

    // Refetch to update list immidiately
    const [createNode, {loading, error}] = useMutation(CREATE_NODE, {
        refetchQueries: [{query: GET_NODES}]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createNode({variables: formData});
        setFormData({...formData, title: '', description: ''})
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <h3>Add a New Thought</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title (e.g., The core assumption)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{ padding: '8px' }}
                />

                {/* Type Selector */}
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ padding: '8px' }}
                >
                    <option value="THEORY">Theory / Framework</option>
                    <option value="AXIOM">Axiom (Foundation)</option>
                    <option value="EVIDENCE">Evidence (Data/Fact)</option>
                    <option value="HYPOTHESIS">Hypothesis (Claim)</option>
                    <option value="DERIVATION">Derivation (Conclusion)</option>
                    <option value="OBJECTION">Objection (Challenge)</option>
                    <option value="METAPHOR">Metaphor</option>
                    <option value="CITATION">Citation</option>
                </select>

                {/* Description Input */}
                <textarea
                    placeholder="Describe your thought..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ padding: '8px' }}
                />

                <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Weaving...' : 'Add to Weave'}
                </button>

                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            </form>
        </div>
    );
}
