import {useMemo, useCallback, useRef, useState, useEffect} from 'react';
import {useQuery} from "@apollo/client/react";
import {gql} from "@apollo/client"
import ForceGraph2D from 'react-force-graph-2d';
import {NodeInspector} from "./utility/NodeInspector.jsx";

const GET_NODES_FOR_GRAPH = gql`
    query GetNodesGraph {
        nodes {
            id
            title
            type
            description
            links {
                type
                target {
                    id
                }
            }
        }
    }
`;

const NODE_COLORS = {
    THEORY: '#FFD700',
    AXIOM: '#4CAF50',
    EVIDENCE: '#2196F3',
    HYPOTHESIS: '#9C27B0',
    DERIVATION: '#FF9800',
    OBJECTION: '#F44336',
    METAPHOR: '#00BCD4',
    CITATION: '#9E9E9E'
};

const LINK_COLORS = {
    PROPOSES: '#FFD700',
    EXPLORES: '#BBBBBB',
    SUPPORTS: '#4CAF50',
    CONTRADICTS: '#F44336',
    DERIVED_FROM: '#FF9800',
    RELATED_TO: '#2196F3'
};

const MAX_LABEL_LENGTH = 22;
const truncateText = (text) => {
    if (!text) return "Unknown";
    if (text.length <= MAX_LABEL_LENGTH) return text;
    return text.substring(0, MAX_LABEL_LENGTH) + "...";
};

export function WeaveGraph() {
    const fgRef = useRef();
    const [selectedNode, setSelectedNode] = useState(null);
    const { loading, error, data = {} } = useQuery(GET_NODES_FOR_GRAPH);

    // Auto-resize graph when sidebar opens/closes
    useEffect(() => {
        if (fgRef.current) {
            // Slight delay to allow CSS flexbox to transition before forcing a canvas resize
            setTimeout(() => {
                const container = document.getElementById('graph-container');
                if (container) {
                    fgRef.current.zoomToFit(400, 50);
                }
            }, 50);
        }
    }, [selectedNode]);

    const graphData = useMemo(() => {
        const rawNodes = data?.nodes;
        if (!Array.isArray(rawNodes)) return { nodes: [], links: [] };

        const nodes = [];
        const links = [];

        rawNodes.forEach(node => {
            nodes.push({
                id: node.id,
                name: node.title,
                type: node.type,
                description: node.description,
                val: node.type === 'THEORY' ? 20 : 10
            });

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

        return { nodes, links };
    }, [data]);

    const handleNodeClick = useCallback(node => {
        setSelectedNode(node);
        if (fgRef.current) {
            // Center the camera on the node. We offset X slightly to account for the sidebar.
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(8, 2000);
        }
    }, [fgRef]);

    const handleBackgroundClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    if (loading) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#aaa'}}>Simulating physics...</div>;
    if (error) return <div style={{color: '#F44336', padding: '20px'}}>Error loading graph: {error.message}</div>;

    return (
        // Full height flex container (assuming the navbar is roughly 70px tall)
        <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 120px)', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #444' }}>

            {/* LEFT PANE: Graph Canvas (Takes up remaining space) */}
            <div id="graph-container" style={{ flex: 1, position: 'relative', width: '80%' }}>
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel={() => ''}
                    nodeColor={node => NODE_COLORS[node?.type] || '#333'}
                    nodeRelSize={6}
                    linkLabel="name"
                    linkColor={link => link?.color || '#888'}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    onNodeClick={handleNodeClick}
                    onBackgroundClick={handleBackgroundClick}

                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = truncateText(node?.name);
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, (node.val || 10) / globalScale, 0, 2 * Math.PI, false);

                        // Highlight selected node with a white stroke
                        if (selectedNode && selectedNode.id === node.id) {
                            ctx.lineWidth = 6 / globalScale;
                            ctx.strokeStyle = '#ffffff';
                            ctx.stroke();
                        }

                        ctx.fillStyle = NODE_COLORS[node?.type] || '#333';
                        ctx.fill();

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.fillText(label, node.x, node.y + ((node.val || 10) / globalScale) + (fontSize));
                    }}
                />
            </div>

            {/* RIGHT PANE: Full Height Sidebar (Takes up exactly 33.33% of the width) */}
            {selectedNode && (
                <div style={{
                    width: '33.33%',
                    minWidth: '350px',
                    borderLeft: '1px solid #444',
                    backgroundColor: '#262424', // Matching your App background
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <NodeInspector
                        node={selectedNode}
                        onClose={() => setSelectedNode(null)}
                        nodeColors={NODE_COLORS}
                    />
                </div>
            )}

        </div>
    );
}