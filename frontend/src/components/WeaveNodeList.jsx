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
                <ul>
                    {data.nodes.map((node) => (
                        <li key={node.id} style={{ marginBottom: '10px' }}>
                            <strong>{node.title}</strong> <span style={{fontSize: '0.8em', color: '#666'}}>({node.type})</span>
                            <p style={{ margin: '5px 0' }}>{node.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}