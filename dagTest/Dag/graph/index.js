import React from 'react'
import { Graph, Path, Addon,  FunctionExt as functionExt } from '@antv/x6'
import '@antv/x6-react-shape'
import AlgoNode from '../shape/nodes/AlgoNode'
import { AlgoEdge as edge } from '../shape/edges/edge'

// import AlgoNodeContextMenu from './contextMenu' // no-extends
// import AlgoNodeContextMenu from './config-node-contextmenu'
import AlgoNodeContextMenuTool from './config-node-contextmenu'

Graph.registerNode(
  'dag-node',
  {
    inherit: 'react-shape',
    width: 180,
    height: 36,
    component: <AlgoNode />,
    // ports: {
    //   groups: {
    //     top: {
    //       position: 'top',
    //       attrs: {
    //         circle: {
    //           r: 4,
    //           magnet: true,
    //           stroke: '#C2C8D5',
    //           strokeWidth: 1,
    //           fill: '#fff',
    //         },
    //       },
    //     },
    //     bottom: {
    //       position: 'bottom',
    //       attrs: {
    //         circle: {
    //           r: 4,
    //           magnet: true,
    //           stroke: '#C2C8D5',
    //           strokeWidth: 1,
    //           fill: '#fff',
    //         },
    //       },
    //     },
    //   },
    // },
  ports: { // 连接桩
    groups: { // 连接桩分组 定义
      in: {
        position: 'top',
        label: {
          position: 'top',
        },
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#282828',
            strokeWidth: 1,
            fill: '#fff',
            zIndex: 3,
            event: 'port:click', // 添加自定义属性 event 来监听该元素的点击事件
          },
        },
      },
      out: {
        position: 'bottom',
        label: {
          position: 'bottom',
        },
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#282828',
            strokeWidth: 1,
            fill: '#fff',
            zIndex: 3,
          },
        },
      },
    }, // ---- groups end ----
    items: [ // 固定个数的锚点配置
      { id: 'port1', group: 'in' },
      { id: 'port2', group: 'out' },
    ],
    },
  },
true, )

Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true,
)


Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 4
    const deltaY = Math.abs(e.y - s.y)
    const control = Math.floor((deltaY / 3) * 2)

    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: e.x, y: e.y - offset - control }

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `,
    )
  },
  true,
)


Graph.registerNodeTool('algonode-contextmenu', AlgoNodeContextMenuTool, false)


export const AlgoEdge = edge

export const AddonFactory = Addon;
export const FunctionExt = functionExt;

const GraphFactory = Graph;
export default GraphFactory;