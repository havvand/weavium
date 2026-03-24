export const transformGraphData = (rawNodes, linkColors) => {
    if (!Array.isArray(rawNodes)) return { nodes: [], links: []} ;

    const nodes = [];
    const links = [];

    rawNodes.forEach(node => {
        nodes.push({
            id: node.id,
            name: node.title,
            type: node.type,
            description: node.description,
            owner: node.owner,
            val: node.type === 'THEORY' ? 20 : 10
        });

        const rawLinks = node?.links;
        if (Array.isArray((rawLinks))) {
            rawLinks.forEach(link => {
                if (link?.target?.id) {
                    links.push({
                        source: node.id,
                        target: link.target.id,
                        name: link.type,
                        color: linkColors[link.type] || '#ccc'
                    });
                }
            });
        }
    });

    return { nodes, links };
};