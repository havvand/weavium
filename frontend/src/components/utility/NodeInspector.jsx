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
    // Setting the setIsEditing to false, and setEditData to ''
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '', type: '' });

    // Reset edit state when a new node is clicked by setting setIsEditing to false again and
    // if another node is clicked replace with new node data.
    useEffect(() => {
        setIsEditing(false);
        if (node) {
            setEditData({ title: node.name, description: node.description || '', type: node.type });
        }
    }, [node]); // Run everytime a new node is passed

    const [deleteNode] = useMutation(DELETE_NODE, {
        refetchQueries: ['GetNodesGraph'],
        onCompleted: () => onClose() // Close and setSelectedNode = null after it disappears from DB
    });

    const [updateNode] = useMutation(UPDATE_NODE, {
        refetchQueries: ['GetNodesGraph'],
        onCompleted: () => {
            setIsEditing(false);
            onClose(); // Close and setSelectedNode = null after update
        }
    });

    if (!node) return null;

    const nodeColor = nodeColors[node.type] || '#333';

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this thought? It will sever all connected links.")) {
            deleteNode({ variables: { id: node.id } }); // Passing the node.id to the deleteNode function
        }
    };

    const handleSave = () => {
        updateNode({
            variables: { // Passing all the needed variables to the updateNode function.
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
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', borderLeft: `5px solid ${nodeColor}`,
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

                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <button onClick={() => setIsEditing(true)} style={{ ...btnStyle, backgroundColor: '#f0f0f0', color: '#333', flex: 1 }}>✏️ Edit</button>
                        <button onClick={handleDelete} style={{ ...btnStyle, backgroundColor: '#ffebee', color: '#d32f2f', flex: 1 }}>🗑️ Delete</button>
                    </div>
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

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={handleSave} style={{ ...btnStyle, backgroundColor: '#4CAF50', color: 'white', flex: 1 }}>💾 Save</button>
                        <button onClick={() => setIsEditing(false)} style={{ ...btnStyle, backgroundColor: '#f0f0f0', color: '#333', flex: 1 }}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
}