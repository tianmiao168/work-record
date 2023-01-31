import GraphFactory from '../graph/index'
import AlgoNode from '../shape/nodes/AlgoNode'
import AlgoEdge from '../shape/edges/AlgoEdge'
import { AlgoNodeContextMenuContent } from '../graph/config-node-contextmenu'


import { BaseLodashEs } from '@/utils'
import { NODE_WIDTH, NODE_HEIGHT } from '../constants'

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a', // '#1890ff',
    },
  },
}
export const get_w_h = (id) => {
  const wrapper = document.getElementById(id)
  if (!wrapper) return { width: 1000, height: 1000 }
  return { width: wrapper.clientWidth - 206 - 32, height: wrapper.clientHeight }
}

export const dagOption = () => {
 return {
  container: document.getElementById(this.hookGraph),
  width: 600,
  height: 600,
  panning: {
    enabled: true,
    eventTypes: ['leftMouseDown', 'mouseWheel'],
  },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    factor: 1.1,
    maxScale: 1.5,
    minScale: 0.5,
  },
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
          strokeWidth: 4,
        },
      },
    },
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    highlight: true,
    connector: 'algo-connector',
    connectionPoint: 'anchor',
    anchor: 'center',
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group') !== 'top'
    },
    createEdge() {
      return graph.createEdge({
        shape: 'dag-edge',
        attrs: {
          line: {
            strokeDasharray: '5 5',
          },
        },
        zIndex: -1,
      })
    },
  },
  selecting: {
    enabled: true,
    multiple: true,
    rubberEdge: true,
    rubberNode: true,
    modifiers: 'shift',
    rubberband: true,
  },
}
}

/**
 * 图绘制配置
 * @param {*} hookGraph 
 * @param {*} hookMinimap 
 * @param {*} width 
 * @param {*} height 
 * @param {*} color 
 * @returns 
 */
export const get_graph_option = (optionItems) => {
  // debugger
  const { container, hookGraph, hookMinimap, width, height, bgcolor, cellMovable = true } = optionItems
  return {
    // container: container,
    container: document.getElementById(hookGraph),
    autoResize: true, // 监听容器大小改变，并自动更新画布大小。
    width,
    height,
    // width: 600,
    // height: 800,
    // async: true,
    // frozen: true,
    // interacting: false, // 节点或边是否可交互（移动等）
    interacting: () => ({ 
      // nodeMovable: (view) => view.cell.prop('movable') !== false,
      nodeMovable: cellMovable,
    }),
    background: {
      color: bgcolor, // 设置画布背景颜色
    },
    grid: { // 渲染网格背景
      size: 10, // 网格大小 10px
      type: 'dot',
      visible: true,
      args: [
        {
          color: '#cccccc',
          // thickness: 1,
        },
        // {
        //   color: '#5F95FF',
        //   thickness: 1,
        //   factor: 4,
        // },
      ],
    },
    selecting: { // 点选/框选，默认禁用
      enabled: false,
      multiple: true,
      rubberband: true, // 启用框选
      movable: true,
      showNodeSelectionBox: true, // 黄色虚线选中框
      filter: ['groupNode'], // 节点过滤器[类型、ID、或function判断]，被过滤的节点将不能被选中
    },
    // 连线
    connecting: {
      // connector: {
      //   name: 'rounded',
      // },
      // router: {
      //   name: 'er',
      //   args: {
      //     direction: 'H',
      //   },
      // },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false, // 许连接到画布空白位置的点，默认为 true
      highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为 false。
      snap: { radius: 20 }, // 当连线过程中与节点或连接桩相距20px时自动吸附

      allowMulti: false, // 是否允许在相同的起始节点和终止之间创建多条边，默认为 true。当设置为 'withPort' 时，
                         // 在起始和终止节点的相同链接桩之间只允许创建一条边（即，起始和终止节点之间可以创建多条边，但必须要要链接在不同的链接桩上）。
      allowLoop: false, // 是否允许边链接到另一个边，默认为 true。
      allowPort: true, // 是否允许边链接到链接桩，默认为 true
      allowNode: false,

      sourceAnchor: 'bottom',
      targetAnchor: 'top',
      magnetThreshold: 'onleave', // 鼠标离开节点后才能创建连线
      clickThreshold: 5, // 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件，默认为 0。
      // createEdge() {
      //   // return new AlgoEdge({
      //   //   attrs: { // 拖动创建连线时，线的样式
      //   //     line: {
      //   //       strokeDasharray: '5 5', // 虚线
      //   //       stroke: '#808080',
      //   //       strokeWidth: 1,
      //   //       zIndex: 1,
      //   //       targetMarker: {
      //   //         name: 'block',
      //   //         size: '8',
      //   //       },
      //   //     },
      //   //   },
      //   //   data: {
      //   //     id: Number(BaseLodashEs.lodash_uniqueId()),
      //   //   },
      //   //   router: {
      //   //     name: 'manhattan',
      //   //   },
      //   //   zIndex: 0,
      //   // })
      // },
      createEdge() {
        return GraphFactory.createEdge({
        shape: 'dag-edge',
        attrs: {
          line: {
            strokeDasharray: '5 5',
          },
        },
        zIndex: -1,
      })
    },
      // 当停止拖动边的时候根据 validateEdge 返回值来判断边是否生效，如果返回 false, 该边会被清除。
      validateEdge: (args) => {
        const { edge } = args
        return !!(edge.target).port
      },
      // 是否触发交互事件
      // 点击 magnet 时 根据 validateMagnet 返回值来判断是否新增边，触发时机是 magnet 被按下，如果返回 false，则没有任何反应，如果返回 true，会在当前 magnet 创建一条新的边。
      validateMagnet({ magnet }) { // 确保只有out连接桩可以拖出线
        // magnet：连接桩的svg结构
        return magnet.getAttribute('port-group') !== 'in'
      },
      // 显示可用的链接桩
      // 在移动边的时候判断连接是否有效，如果返回 false，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。
      validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
        // 不允许连接到自己
        if (sourceView === targetView) {
          return false
        }

        // 只能从输出链接桩创建连接
        if ( !sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in' ) {
          return false
        }

        // 只能连接到输入链接桩
        if ( !targetMagnet || targetMagnet.getAttribute('port-group') !== 'in' ) {
          return false
        }
        // 判断目标链接桩是否可连接
        const portId = targetMagnet.getAttribute('port')
        const node = targetView.cell
        const port = node.getPort(portId)
        return !(port && port.connected)
      },
    },
    // 指定触发某种交互时的高亮样式： 节点 或 边 高亮器
    highlighting: {
      // 连线过程中，节点可以被链接时被使用
      // nodeAvailable: {
      //   name: 'className',
      //   args: {
      //     className: 'available',
      //   },
      // },
      // 连线过程中，链接桩可以被链接时被使用
      magnetAvailable: magnetAvailabilityHighlighter,
      // 连线过程中，自动吸附到链接桩时被使用
      // magnetAdsorbed: {
      //   name: 'className',
      //   args: {
      //     className: 'adsorbed',
      //   },
      // },
    },
    snapline: true, // 对齐线是移动节点排版的辅助工具，默认禁用
    // history: {
    //   enabled: true,
    //   beforeAddCommand(event, options) {
    //     // 鼠标移入和移除时触发 添加 和 删除 工具，不应该添加到历时记录中
    //     if (
    //       event === 'cell:change:*' &&
    //       options != null &&
    //       options.key === 'tools'
    //     ) {
    //       return false
    //     }

    //     if (event === 'cell:removed') {
    //       const cell = options && options.cell
    //       if (cell) {
    //         cell.removeTools()
    //       }
    //     }
    //   },
    // },
    clipboard: { // 剪切板，默认禁用
      enabled: false,
    },
    keyboard: { // 键盘快捷键，默认禁用
      enabled: false,
    },
    // mousewheel: { // 使用滚轮拖动画布，按下键盘配置键后可缩放画布
    //   enabled: true,
    //   modifiers: ['ctrl', 'meta'],
    // },
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox()
        return this.getNodes().filter((node) => {
          // 只有 data.parent 为 true 的节点才是父节点
          const data = node.getData()
          if (data && data.parent) {
            const targetBBox = node.getBBox()
            return bbox.isIntersectWithRect(targetBBox)
          }
          return false
        })
      },
    },
    panning: {
      enabled: true, // 画布是否可平移 按下鼠标左键平移
      // modifiers: 'shift', // 设置 modifiers 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽
    },
    // scroller: true,
    scroller: {
      enabled: true, // 画布是否可滚动
      pannable: true, //  画布是否可滚轮平移
      pageVisible: false, // 是否分页
      pageBreak: false, // 是否显示分页符
      // className: 'datastudio-x6-scroller',
      // modifiers: 'shift',// 设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。
      // width: 10, // Scroller 的宽度，默认为画布容器宽度
      // height: 10,
      // autoResize: false, // 监听容器大小改变，并自动更新画布大小. 搭配flex使用
    },
    // resizing: false, // 缩放节点
    // resizing: { // 缩放节点
    //   enabled: false,
    //   minWidth: 0,
    //   minHeight: 0,
    //   maxWidth: 1980, // Number.MAX_SAFE_INTEGER,
    //   maxHeight: 1980, // Number.MAX_SAFE_INTEGER,
    //   orthogonal: true,
    //   restricted: false,
    //   autoScroll: true,
    //   preserveAspectRatio: false,
    //   allowReverse: true,
    // },
    translating: {
      restrict: false, // 配置节点的可移动区域，默认值为 false.  节点、边的移动，不可超过画布
    },
    scaling: {
      min: 0.5,
      max: 2,
    },
    minimap: {
      enabled: true,
      container: document.getElementById(hookMinimap),
      width: 110,
      height: 110,
      padding: 0,
      scalable: false,
      graphOptions: {
        //   async: true,
        //   getCellView(cell) {
        //     if (cell.isNode()) {
        //       return SimpleNodeView
        //     }
        //   },
        // 是否在缩略图中绘制连线
        createCellView(cell) {
          if (cell.isEdge()) {
            return null
          }
        },
      },
    },

    /**
     * 锚点渲染回调
     */
    onPortRendered(args) {
      const { port, node } = args
      // const { contentSelectors, node } = args
      // const container = contentSelectors && contentSelectors.content // span

      // const placement = port.group === 'in' ? 'top' : 'bottom'
      // if (node.data.nodeType === 'start') {
      //   node.removePort('port1') // 锚点 进
      // }
      // if (node.data.nodeType === 'stop') {
      //   node.removePort('port2') // 锚点 出
      // }
      // if (container) {
      //   ReactDOM.render(
      //     (
      //       <ConfigProvider prefixCls={ANT_PREFIX}>
      //         <Tooltip
      //           title={(port as any).description}
      //           placement={placement}
      //         >
      //           <span
      //             className={classnames('ais-port', {
      //               connected: (port as any).connected,
      //             })}
      //           />
      //         </Tooltip>
      //       </ConfigProvider>
      //     ) as any,
      //     container as any,
      //   )
      // }
    },
  } // ---------------- graphOptions end ----------------
}
/**
 * 创建节点实例
 * @param {*} meta节点数据 SdpGraph.NodeType
 */
export const createNodeInstance = (graphInstance, nodedata, shape = 'dag-node') => {
  // console.log(222, nodedata)
  // 根据节点类型项配置锚点数组
  let portsArr = [ { id: 'in', group: 'in' }, { id: 'out', group: 'out' } ]
  // if (nodedata.languageType === 'start') {
  //   portsArr = [{ id: 'out', group: 'out' }]
  // } else if (nodedata.languageType === 'stop') {
  //   portsArr = [{ id: 'in', group: 'in' } ]
  // }
  // const portsArr = [
  //   {
  //     id: nodedata.nodeId + '-1',
  //     group: 'top'
  //   },
  //   {
  //     id: nodedata.nodeId + '-2',
  //     group: 'bottom'
  //   }
  // ]

  return graphInstance.createNode({
    ports: portsArr,
    shape,
    x: nodedata.x,
    y: nodedata.y,
    data: nodedata, // AlgoNode.tsx使用
  })
}
/**
 * 创建 连线实例
 * @param {*} meta节点数据 SdpGraph.NodeType
 */
export const createEdgeInstance = (graphInstance, edgedata, shape = 'dag-edge') => {
  return graphInstance.createEdge({
    shape,
    source: edgedata.source,
    target: edgedata.target,
    defaultLabel: 666,
    // attrs: {
    //   line: {
    //     strokeDasharray: '5 5',
    //   },
    // },
    // zIndex: -1,
  })
}
/**
 * 创建图节点
 * @param {*} graphInstance 
 * @param {*} meta 
 * @returns 
 */
export const createStencilNode = (graphInstance, meta) => {
  // console.log('--meta createStencilNode ---', meta)
  return graphInstance.createNode({
    shape: 'dag-node',
    label: meta.processorName || meta.label,
    // width: NODE_WIDTH,
    // height: NODE_HEIGHT,
    ...meta,
    data: {
      ...meta,
      label: meta.processorName || meta.label,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      status: '',
      showStatus: false,
    },
  })
}

/**
 * 获取stencil groups 数据 实例
 * groups: [
    {
      name: 'group1',
      title: 'Group-1',
    },
    {
      name: 'group2',
      title: 'Group',
      // collapsable: false,
    },
  ],
 */
export const getStencilList = (graphInstance, list) => {
  const filterGroups = { set: [], children: [] }

  for (const _gs of list) {
    const _group = {
      name: _gs.groupId + '',
      title: _gs.groupName,
      value: _gs.groupId,
      collapsable: true,
      graphHeight: 0
    }

    const _children = []
    _gs.processorList.map(item => {
      const _c = createStencilNode(graphInstance, Object.assign(item, {
        label: item.processorName,
        newNode: true,
        ports: {},
      }))
      _children.push(_c)
    })
    _group.graphHeight = _children.length * 50
    filterGroups.set.push(_group)
    filterGroups.children.push(_children)
  }

  return filterGroups
}
/**
 * 过滤从后台获取的执行器列表，格式化为G6所需的类型
 */
export const filter_actuator_list = (actuatorList) => {
  const _arr = actuatorList || []
  const returnData = []
  _arr.forEach(group => {
    const _nodeList = []
    for (const _node of group.nodeList) {
      const _nodeTemplate = {
        shape: 'node',
        // shape: 'rect', // 绘制形状
        type: 'node', // 用于添加等操作分辨是节点还是线
        name: _node.name,
        label: _node.name,

        id: _node.id,
        creatorId: _node.creatorId,
        editorId: _node.editorId,
        groupId: _node.groupId,
        color: _node.color,
        createDate: _node.createDate,
        updateDate: _node.updateDate,
        deleteFlag: _node.deleteFlag,

        jobHandle: _node.jobHandle,
        processorType: _node.processorType,
        languageType: _node.languageType,
        logoContent: _node.logoContent,
        // authorityLock: _node.authorityLock,

        dragAble: _node.dragAble
      }

      _nodeList.push(_nodeTemplate)
    }
    const _mergeGroup = {
      name: group.name,
      type: group.type,
      environmentType: group.environmentType,
      list: _nodeList
    }
    returnData.push(_mergeGroup)
  })

  return returnData
}

/**
 * 
 * 将传入的图的数据（节点和边）转换为后端所需格式
 */
export const filter_graphic_cells = (cells) => { 
  const filteNodes = []
  const filterEdgs = []
  for (const cell of cells) {
    if (cell.isNode()) { // 节点
      debugger
      const nodeData = cell?.getData() || cell.data || cell._extensionData
      // console.log(1110, nodeData)
      const nodeId = nodeData.id || nodeData.nodeId // 
      if (nodeId && nodeData.jobId) {
        const _obj = {
          // label: nodeData.label || nodeData.nodeName || 'can`t null',
          nodeName: nodeData.label || nodeData.nodeName || 'can`t null',
          nodeId: nodeId,
          jobId: nodeData.jobId,
          languageType: nodeData.languageType, // 前端区分调用的模板
          nodeType: nodeData.processorType,
          status: null, // 这里状态为非运行状态
          runStatus: null, // 运行状态，每次查询需要去实例中获取
          instanceId: null, // 如果不是在任务流实例里面，为空
          x: nodeData.x,
          y: nodeData.y,
        }
        filteNodes.push(_obj)
      }
    } else { // 边
      debugger
      const _edg = {
        // id: cell.data ? cell.data.id : Number(_.uniqueId()),
        source: cell.source.cell,
        target: cell.target.cell,
        // source: Number(cell.source.cell),
        // target: Number(cell.target.cell),
        // createTime: null,
        // updateTime: null
      }
      filterEdgs.push(_edg)
    }
  }

  return { nodes: filteNodes, edges: filterEdgs }
}
/**
 * 过滤后端 返回的节点、连线数据 为绘制图所需的格式
 */
export const filter_response_dagdata = (data) => {
  const _nodes = []
  for (const _n of data.nodes || []) {
    Object.assign(_n, {
      id: _n.nodeId,
      label: _n.nodeName,
      processorType: _n.nodeType || ''
    })
    _nodes.push(_n)
  }
  data.nodes = _nodes
  return data
}
