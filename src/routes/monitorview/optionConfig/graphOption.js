import graph from './graph.json'
let categories = []
for (let i = 0; i < 9; i++) {
    categories[i] = {
        name: `类目${i}`,
    }
}
graph.nodes.forEach((node) => {
    node.itemStyle = null
    node.value = node.symbolSize
    node.symbolSize /= 1.5
    node.label = {
        normal: {
            show: node.symbolSize > 10,
        },
    }
    node.category = node.attributes.modularity_class
})
export const graphOption = {
    title: {
        text: 'Les Miserables',
        subtext: 'Circular layout',
        top: 'bottom',
        left: 'right',
    },
    tooltip: {},
    legend: [{
        // selectedMode: 'single',
        data: categories.map((a) => {
            return a.name
        }),
    }],
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
                rotateLabel: true,
            },
            data: graph.nodes,
            links: graph.links,
            categories,
            roam: true,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}',
                },
            },
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0.3,
                },
            },
        },
    ],
}
