import { Graph } from '@antv/x6'
import {
  createNodeInstance,
} from '../utils'
/**
 * 渲染节点 连线
 * @param graph 
 * @param data 
 */
export function renderCells(graph: Graph, data) {
  const cells = []
  data.forEach((item) => {
    if (item.shape === 'dag-node') {
      cells.push(graph.addNode(item))
    } else {
      cells.push(graph.addEdge(item))
    }
  })

  graph.resetCells(cells)
}

/**
 * 渲染节点 连线
 * @param graph 
 * @param data 
 */
export function renderCustomCells(graph: Graph, data) {
  const cells = []
  data.nodes.forEach((item) => {
    const cnode = createNodeInstance(graph, item) // 创建新节点, meta:节点元数据。
    cells.push(graph.addNode(cnode))
  })
  data.edges.forEach((item) => {
    cells.push(graph.addEdge(item))
  })

  graph.resetCells(cells)
}

/**
 * 显示节点状态
 * @param graph 
 * @param statusList 
 */
export function showNodeStatus (graph, statusList) {
  const status = statusList.shift()
  status?.forEach((item) => {
    const { id, status } = item
    const node = graph.getCellById(id)
    const data = node.getData()
    node.setData({
      ...data,
      status: status,
    })
  })
}
