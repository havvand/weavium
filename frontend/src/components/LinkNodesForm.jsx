import {useEffect, useState} from 'react';
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

export function LinkNodesForm({ prefilledSourceId, isDark }) {
    const [sourceId, setSourceId] = useState('');
    const [targetId, setTargetId] = useState('');
    const [type, setType] = useState('SUPPORTS');

    useEffect(() => {
        if (prefilledSourceId) {
            setSourceId(prefilledSourceId);
        }
    }, [prefilledSourceId]);

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

    const containerStyle = isDark
        ? { padding: '20px', backgroundColor: '#262424', borderRadius: '8px', textAlign: 'left', color: '#fff' }
        : { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', backgroundColor: '#f9f9f9' };

    const inputStyle = isDark
        ? { padding: '8px', border: '1px solid #555', borderRadius: '4px', backgroundColor: '#363434', color: '#fff' }
        : { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' };

    return (
        <div style={{
            containerStyle
        }}>
            <h3 style={{ marginTop: 0 }}>{isDark ? '🔗 Attach Thought' : 'Connect Thoughts'}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* ONLY show the Source dropdown if we DON'T have a prefilled source */}
                    {!prefilledSourceId && (
                        <select
                            value={sourceId}
                            onChange={(e) => setSourceId(e.target.value)}
                            style={{ ...inputStyle, flex: 1, width: '100%' }}
                            required
                        >
                            <option value="">Select Source Node...</option>
                            {nodeData.nodes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                        </select>
                    )}

                    {/* Relationship Type */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={!prefilledSourceId ? { padding: '8px', width: '20%'} : { padding: '8px', width: '100%'} }
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

                <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                    required
                >
                    <option value="">Select Target Node...</option>
                    {/* Filter out the source node so users can't link a node to itself! */}
                    {nodeData.nodes.filter(n => n.id !== sourceId).map(n =>
                        <option key={n.id} value={n.id}>{n.title}</option>

                    )}

                </select>

                <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    {loading ? 'Linking...' : 'Create Connection'}
                </button>

                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            </form>
        </div>
    );
}
