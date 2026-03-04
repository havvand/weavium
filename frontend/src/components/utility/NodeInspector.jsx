import {gql} from "@apollo/client";
import { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client/react";

const DELETE_NODE = gql`
    mutation DeleteNode($id: ID!){
        deleteNode(id: $id)
    }
`;

const UPDATE_NODE = gql`
    mutation UpdateNode($id: ID!, $title: String, $description: String, $type: NodeType) {
        updateNode(id: $id, title: $title, description: $description, type: $type) {
            id
        }
    }
`;
export function NodeInspector({ node, onClose, nodeColors }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // NEW: Tracks if we are confirming deletion
    const [errorMsg, setErrorMsg] = useState(''); // NEW: Tracks errors safely without alert()
    const [editData, setEditData] = useState({ title: '', description: '', type: '' });

    // Reset states when a new node is clicked
    useEffect(() => {
        setIsEditing(false);
        setShowConfirm(false);
        setErrorMsg('');
        if (node) {
            setEditData({ title: node.name, description: node.description || '', type: node.type });
        }
    }, [node]);

    // Include GetNodesSimple and GetNodes so deleting from the graph also updates the Quick Capture lists!
    const [deleteNode, { loading: isDeleting }] = useMutation(DELETE_NODE, {
        refetchQueries: ['GetNodesGraph'],
        onCompleted: () => {
            setShowConfirm(false);
            onClose();
        },
        onError: (err) => setErrorMsg("Failed to delete: " + err.message)
    });

    const [updateNode] = useMutation(UPDATE_NODE, {
        refetchQueries: ['GetNodesGraph'],
        onCompleted: () => {
            setIsEditing(false);
            onClose();
        },
        onError: (err) => setErrorMsg("Failed to update: " + err.message)
    });

    if (!node) return null;

    const nodeColor = nodeColors[node.type] || '#333';

    // Trigger the actual mutation
    const confirmDelete = () => {
        deleteNode({ variables: { id: node.id } });
    };

    const handleSave = () => {
        updateNode({
            variables: {
                id: node.id,
                title: editData.title,
                description: editData.description,
                type: editData.type
            }
        });
    };

    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
    const btnStyle = { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

    return (
        <div style={{
            position: 'absolute', top: '20px', right: '20px', width: '320px', maxHeight: '550px',
            overflowY: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '20px',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', borderLeft: `5px solid ${nodeColor}`,
            zIndex: 100, textAlign: 'left'
        }}>

            <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer', color: '#888' }}>✕</button>

            {!isEditing ? (
                // --- READ MODE ---
                <>
          <span style={{ fontSize: '0.8em', fontWeight: 'bold', color: nodeColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {node.type}
          </span>
                    <h3 style={{ marginTop: '5px', marginBottom: '15px', color: '#2c3e50' }}>{node.name}</h3>
                    <p style={{ fontSize: '0.9em', color: '#555', lineHeight: '1.5', marginBottom: '25px' }}>
                        {node.description || <i style={{color: '#aaa'}}>No description provided.</i>}
                    </p>

                    {/* Render errors safely without alert() */}
                    {errorMsg && <p style={{ color: '#d32f2f', fontSize: '0.85em', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{errorMsg}</p>}

                    {/* NEW: Custom confirmation UI */}
                    {showConfirm ? (
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: '4px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#e65100', fontWeight: 'bold' }}>Delete this thought?</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={confirmDelete} disabled={isDeleting} style={{ ...btnStyle, backgroundColor: '#d32f2f', color: 'white', flex: 1 }}>
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button onClick={() => setShowConfirm(false)} disabled={isDeleting} style={{ ...btnStyle, backgroundColor: '#f0f0f0', color: '#333', flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Default buttons
                        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <button onClick={() => setIsEditing(true)} style={{ ...btnStyle, backgroundColor: '#f0f0f0', color: '#333', flex: 1 }}>✏️ Edit</button>
                            <button onClick={() => setShowConfirm(true)} style={{ ...btnStyle, backgroundColor: '#ffebee', color: '#d32f2f', flex: 1 }}>🗑️ Delete</button>
                        </div>
                    )}
                </>
            ) : (
                // --- EDIT MODE ---
                <>
                    <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Edit Node</h4>

                    <label style={{ fontSize: '0.8em', color: '#666' }}>Type</label>
                    <select
                        value={editData.type}
                        onChange={e => setEditData({...editData, type: e.target.value})}
                        style={inputStyle}
                    >
                        {Object.keys(nodeColors).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <label style={{ fontSize: '0.8em', color: '#666' }}>Title</label>
                    <input
                        type="text"
                        value={editData.title}
                        onChange={e => setEditData({...editData, title: e.target.value})}
                        style={inputStyle}
                    />

                    <label style={{ fontSize: '0.8em', color: '#666' }}>Description</label>
                    <textarea
                        value={editData.description}
                        onChange={e => setEditData({...editData, description: e.target.value})}
                        rows={5}
                        style={inputStyle}
                    />

                    {errorMsg && <p style={{ color: '#d32f2f', fontSize: '0.85em', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{errorMsg}</p>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={handleSave} style={{ ...btnStyle, backgroundColor: '#4CAF50', color: 'white', flex: 1 }}>💾 Save</button>
                        <button onClick={() => setIsEditing(false)} style={{ ...btnStyle, backgroundColor: '#f0f0f0', color: '#333', flex: 1 }}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
}