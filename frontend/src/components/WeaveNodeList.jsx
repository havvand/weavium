import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

// Define Query - macthes ones in GraphQL
const GET_NODES = gql`
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

export function WeaveNodeList() {
    // Hook to fetch data
    const {loading, error, data } = useQuery(GET_NODES);

    if (loading) return <p>Loading ideas... </p>
    if (error) return <p>Error connecting to backend: {error.message}</p>

    return (
        <div style={{ padding: '20px', textAlign: 'left' }}>
            <h2>Current Weave</h2>
            {data.nodes.length === 0 ? (
                <p>No thoughts yet. Use GraphiQL to add one!</p>
            ) : (
                <ul style ={{listStyle: 'none', padding: 0}}>
                    {data.nodes.map((node) => (
                        <li key={node.id} style={{
                            marginBottom: '15px',
                            padding: '15px',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            backgroundColor: '#frff'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <strong style={{ fontSize: '1.2em', color: '#727272' }}>{node.title}</strong>
                                <span style={{
                                    fontSize: '0.8em',
                                    backgroundColor: '#727272',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}>
                  {node.type}
                </span>
                            </div>
                            <p style={{ margin: '10px 0', color: '#555' }}>{node.description}</p>

                            {/* NEW: Display Connections */}
                            {node.links.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                    <strong>Connections:</strong>
                                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                                        {node.links.map((link, index) => (
                                            <li key={index}>
                                                <span style={{ color: '#007bff' }}>{link.type}</span>
                                                {' → '}
                                                {link.target.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}