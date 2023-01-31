import { Edge as BaseEdge } from '@antv/x6'

export default class AlgoEdge extends BaseEdge {}

AlgoEdge.config({
  shape: 'dag-edge',
  zIndex: 1,
  connectionPoint: 'anchor',
  sourceAnchor: 'bottom',
  targetAnchor: 'center',
  lable: '',
  attrs: {
    line: {
      stroke: '#C2C8D5',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
})