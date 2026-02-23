import {useMemo, useCallback, useRef} from 'react';
import {useQuery} from "@apollo/client/react";
import {gql} from "@apollo/client"
import ForceGraph2D from 'react-force-graph-2d';

const GET_NODES_FOR_GRAPH = gql`
    query GetNodesGraph {
        nodes {
            id
            title
            type
            links {
                type
                target {
                    id
                }
            }
        }
    }
`;

// Map Ubiquitious language to colors
const NODE_COLORS = {
    THEORY: '#FFD700',      // Gold (The Anchor)
    AXIOM: '#4CAF50',       // Green (Solid foundation)
    EVIDENCE: '#2196F3',    // Blue (Data)
    HYPOTHESIS: '#9C27B0',  // Purple (Speculative)
    DERIVATION: '#FF9800',  // Orange (Logical steps)
    OBJECTION: '#F44336',   // Red (Conflict)
    METAPHOR: '#00BCD4',    // Cyan
    CITATION: '#9E9E9E'     // Grey
};

// Edge colors based on logic
const LINK_COLORS = {
    PROPOSES: '#FFD700',
    EXPLORES: '#BBBBBB',
    SUPPORTS: '#4CAF50',
    CONTRADICTS: '#F44336',
    DERIVED_FROM: '#FF9800',
    RELATED_TO: '#2196F3'
};

export function WeaveGraph() {
    const fgRef = useRef();
    const { loading, error, data } = useQuery(GET_NODES_FOR_GRAPH);

    // Transform GraphQL Tree into Flat Graph Object using useMemo - performance
    const graphData = useMemo(() => {
        const rawNodes = data?.nodes;

        if (!Array.isArray(rawNodes)) {
            return { nodes: [], links: [] };
        }

        const nodes = [];
        const links = [];

        rawNodes.forEach(node => {
            nodes.push({
                id: node.id,
                name: node.title,
                type: node.type,
                val: node.type === 'THEORY' ? 20 : 10
            });


            // Add Links
            const rawLinks = node?.links;
            if (Array.isArray(rawLinks)) {
                rawLinks.forEach(link => {
                    if (link?.target?.id) {
                        links.push({
                            source: node.id,
                            target: link.target.id,
                            name: link.type,
                            color: LINK_COLORS[link.type] || '#ccc'
                        });
                    }
                });
            }
        });

        return {nodes, links };
    }, [data]);

    // Center camera on a node when clicked
    const handleNodeClick = useCallback(node => {
        if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(8, 2000);
        }
    }, [fgRef]);

    if (loading) return <p> Simulating </p>
    if (error) return <p>Error loading graph: {error.message}</p>

    return (
        <div style={{ border: '2px solid #2c3e50', borderRadius: '8px', overflow: 'hidden', height: '600px', backgroundColor: '#fcfcfc' }}>
            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="name"
                nodeColor={node => NODE_COLORS[node.type] || '#333'}
                nodeRelSize={6}
                linkLabel="name"
                linkColor={link => link.color}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                onNodeClick={handleNodeClick}

                // Custom canvas drawing to show text labels under the nodes
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                    // Draw Node Circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val / globalScale, 0, 2 * Math.PI, false);
                    ctx.fillStyle = NODE_COLORS[node.type] || '#333';
                    ctx.fill();

                    // Draw Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#111';
                    ctx.fillText(label, node.x, node.y + (node.val / globalScale) + (fontSize));
                }}
            />
        </div>
    );
}