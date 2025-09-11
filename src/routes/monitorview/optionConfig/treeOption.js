import data from './tree.json'
export const treeOption = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
    },
    series: [
        {
            type: 'tree',

            data: [data],

            top: '18%',
            bottom: '14%',

            layout: 'radial',

            symbol: 'emptyCircle',

            symbolSize: 7,

            initialTreeDepth: 3,

            animationDurationUpdate: 750,

        },
    ],
}
