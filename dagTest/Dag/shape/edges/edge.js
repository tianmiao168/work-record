import { Shape, Edge } from '@antv/x6'

export class BaseEdge extends Shape.Edge {
  // eslint-disable-next-line class-methods-use-this
  isGroupEdge() {
    return false
  }
}

export class AlgoEdge extends BaseEdge {}

AlgoEdge.config({
  shape: 'algo-edge',
  connector: { name: 'custom-edge-smooth' }, // 连接线<d>路径
  zIndex: 1,
  // source: { cell: 'port2', port: 'out' }, // 节点的中心
  // target: { cell: 'port1', port: 'in' },
  // source: { 
  //   cell: 'anchor', 
  //   anchor: { 
  //     name: 'bottom', 
  //     args: {
  //       dx: 10,
  //     },
  //   },
  // },
  // target: { 
  //   cell: 'anchor', 
  //   anchor: 'top', // 没有参数时可以简化写法
  // },
  connectionPoint: 'anchor',
  sourceAnchor: 'bottom',
  targetAnchor: 'center',
  attrs: {
    line: {
      stroke: '#808080',
      strokeWidth: 1,
      zIndex: 1,
      targetMarker: {
        name: 'block',
        size: '8',
        // width: 10,
        // height: 8,
        // offset: -6,
        // stroke: '#808080',
        // fill: '#808080',
        // strokeWidth: 1,
      },
    },
    label: {},
    // body: {
    //   cursor: 'pointer',
    //   ref: 'label',
    //   refX: '-20%',
    //   refY: '-20%',
    //   refWidth: '140%',
    //   refHeight: '140%',
    //   fill: 'white',
    //   stroke: 'black',
    //   strokeWidth: 1,
    // },
  },
})
export class AlgoGroupEdge extends AlgoEdge {
  // eslint-disable-next-line class-methods-use-this
  isGroupEdge() {
    return true
  }
}

AlgoGroupEdge.config({
  shape: 'AlgoGroupEdge',
})

// Edge.registry.register('ais-edge', AlgoEdge)

Edge.registry.register({
  AlgoEdge: AlgoEdge,
  AlgoGroupEdge: AlgoGroupEdge,
})
