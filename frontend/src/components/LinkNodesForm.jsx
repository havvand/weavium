import { useState } from 'react';
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// The mutation
const LINK_NODES = gql `
mutation LinkNodes($sourceId: ID!, $targetId: ID!, $type: RelationshipType!) {
    linkNodes(sourceId: $sourceId, targetId: $targetId, type: $type) {
        id
        links {
            type
            target {
                title
            }
        }
    }
}
`;

// List of nodes to populate the dropdown
const GET_NODES_SIMPLE = gql`
    query GetNodesSimple {
        nodes {
            id
            title
        }
    }
`;

// Refresh UI after linking
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

export function LinkNodesForm() {
    const [sourceId, setSourceId] = useState('');
    const [targetId, setTargetId] = useState('');
    const [type, setType] = useState('SUPPORTS');

    const { data: nodeData } = useQuery(GET_NODES_SIMPLE);

    const [linkNodes, { loading, error }] = useMutation(LINK_NODES, {
        refetchQueries: [{ query: GET_NODES_FULL }]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sourceId || !targetId) return;
        if (sourceId === targetId) {
            alert("Cannot link a node to itself!");
            return;
        }

        linkNodes({ variables: { sourceId, targetId, type } });
        // Reset target only, so you can easily link one source to multiple targets
        setTargetId('');
    };

    if (!nodeData) return null;

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>Connect Thoughts</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Source Node */}
                    <select
                        value={sourceId}
                        onChange={(e) => setSourceId(e.target.value)}
                        style={{ padding: '8px', flex: 1 }}
                        required
                    >
                        <option value="">Select Source Node...</option>
                        {nodeData.nodes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                    </select>

                    {/* Relationship Type */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ padding: '8px', width: '120px' }}
                    >
                        <optgroup label="Logical">
                            <option value="SUPPORTS">SUPPORTS</option>
                            <option value="CONTRADICTS">CONTRADICTS</option>
                            <option value="DERIVED_FROM">DERIVED FROM</option>
                        </optgroup>
                        <optgroup label="Structural">
                            <option value="PROPOSES">PROPOSES</option>
                            <option value="EXPLORES">EXPLORES</option>
                        </optgroup>
                        <optgroup label="Semantic">
                            <option value="RELATED_TO">RELATED TO</option>
                        </optgroup>
                    </select>
                </div>

                {/* Target Node */}
                <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    style={{ padding: '8px', width: '100%' }}
                    required
                >
                    <option value="">Select Target Node...</option>
                    {nodeData.nodes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                </select>

                <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {loading ? 'Linking...' : 'Create Connection'}
                </button>

                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            </form>
        </div>
    );
}
