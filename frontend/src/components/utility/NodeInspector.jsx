import {gql} from "@apollo/client";
import { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client/react";

const DELETE_NODE = gql`
    mutation DeleteNode($id: ID!) {
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
    const [activeTab, setActiveTab] = useState('INFO'); // 'INFO' or 'CONNECTIONS'
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [editData, setEditData] = useState({ title: '', description: '', type: '' });

    useEffect(() => {
        setIsEditing(false);
        setShowConfirm(false);
        setErrorMsg('');
        if (node) {
            setEditData({ title: node.name, description: node.description || '', type: node.type });
        }
    }, [node]);

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
        },
        onError: (err) => setErrorMsg("Failed to update: " + err.message)
    });

    if (!node) return null;

    const nodeColor = nodeColors[node.type] || '#888';

    const confirmDelete = () => deleteNode({ variables: { id: node.id } });

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

    // --- UI Styles for Dark Mode ---
    const inputStyle = {
        width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px',
        border: '1px solid #555', backgroundColor: '#363434', color: '#fff', boxSizing: 'border-box'
    };
    const btnStyle = { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' };
    const tabStyle = (isActive) => ({
        flex: 1, padding: '15px 0', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold',
        borderBottom: isActive ? `3px solid ${nodeColor}` : '3px solid transparent',
        color: isActive ? '#fff' : '#888',
        backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent'
    });

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#eee' }}>

            {/* Header Area with Top Border Accent */}
            <div style={{ padding: '20px', borderTop: `5px solid ${nodeColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8em', fontWeight: 'bold', color: nodeColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {node.type}
        </span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer', color: '#aaa' }}>✕</button>
            </div>

            {/* Node Title */}
            <div style={{ padding: '0 20px 20px 20px' }}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5em', lineHeight: '1.3' }}>{node.name}</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: '20px' }}>
                <div style={tabStyle(activeTab === 'INFO')} onClick={() => setActiveTab('INFO')}>Details</div>
                <div style={tabStyle(activeTab === 'CONNECTIONS')} onClick={() => setActiveTab('CONNECTIONS')}>Connections</div>
                <div style={tabStyle(activeTab === 'AUTHOR')} onClick={() => setActiveTab('AUTHOR')}>Author</div>

            </div>

            {/* Scrollable Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px' }}>

                {errorMsg && <p style={{ color: '#ff8a80', fontSize: '0.85em', padding: '10px', backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: '4px', border: '1px solid #ff8a80' }}>{errorMsg}</p>}

                {activeTab === 'INFO' && (
                    <>
                        {!isEditing ? (
                            // READ MODE
                            <>
                                <h4 style={{ color: '#aaa', margin: '0 0 10px 0', fontSize: '0.85em', textTransform: 'uppercase' }}>Description</h4>
                                <p style={{ fontSize: '1em', color: '#ccc', lineHeight: '1.6', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>
                                    {node.description || <i style={{color: '#666'}}>No description provided.</i>}
                                </p>

                                {showConfirm ? (
                                    <div style={{ padding: '15px', backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #ff8a80', borderRadius: '6px' }}>
                                        <p style={{ margin: '0 0 15px 0', fontSize: '0.9em', color: '#ff8a80', fontWeight: 'bold' }}>Sever links and delete this node?</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={confirmDelete} disabled={isDeleting} style={{ ...btnStyle, backgroundColor: '#d32f2f', color: 'white', flex: 1 }}>
                                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                            </button>
                                            <button onClick={() => setShowConfirm(false)} disabled={isDeleting} style={{ ...btnStyle, backgroundColor: '#444', color: '#fff', flex: 1 }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button onClick={() => setIsEditing(true)} style={{ ...btnStyle, backgroundColor: '#363434', border: '1px solid #555', color: '#fff', flex: 1 }}>✏️ Edit Node</button>
                                        <button onClick={() => setShowConfirm(true)} style={{ ...btnStyle, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#ff8a80', flex: 1 }}>🗑️ Delete</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            // EDIT MODE
                            <>
                                <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '5px' }}>Node Type</label>
                                <select
                                    value={editData.type}
                                    onChange={e => setEditData({...editData, type: e.target.value})}
                                    style={inputStyle}
                                >
                                    {Object.keys(nodeColors).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>

                                <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '5px' }}>Title</label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={e => setEditData({...editData, title: e.target.value})}
                                    style={inputStyle}
                                />

                                <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={e => setEditData({...editData, description: e.target.value})}
                                    rows={8}
                                    style={inputStyle}
                                />

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button onClick={handleSave} style={{ ...btnStyle, backgroundColor: '#4CAF50', color: 'white', flex: 1 }}>💾 Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} style={{ ...btnStyle, backgroundColor: '#444', color: '#fff', flex: 1 }}>Cancel</button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'CONNECTIONS' && (
                    <div>
                        <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '20px' }}>
                            Manage relationships or attach new thoughts to this node.
                        </p>

                        {/* Placeholder for future Idea 1 feature */}
                        <div style={{ padding: '20px', backgroundColor: '#363434', border: '1px dashed #666', borderRadius: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}>🔗</span>
                            <p style={{ margin: '0 0 15px 0', color: '#ccc' }}>Ready to grow the web.</p>
                            <button style={{ ...btnStyle, backgroundColor: nodeColor, color: '#111', width: '100%' }}>
                                + Attach New Thought
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'AUTHOR' && (
                    <div>
                        <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '20px' }}>
                            Author Information
                        </p>

                        {/* Placeholder for information */}
                        <div style={{ padding: '20px', marginBottom: '10px', backgroundColor: '#363434', border: '1px dashed #666', borderRadius: '6px', textAlign: 'center' }}>

                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#363434', border: '1px dashed #666', borderRadius: '6px', textAlign: 'center' }}>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}