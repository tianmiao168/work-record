/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
const MySplitPane: BASETP.SplitPaneType = SplitPane;
const MyPane: BASETP.PaneType = Pane;
import { uuid_str } from '@/utils';
// import { Graph } from '@antv/x6'
import GraphFactory, { AddonFactory } from './graph/index'; // , AlgoEdge
// import Stencil from './graph/config-stencil'
// import data from './data'
import { renderCustomCells, showNodeStatus } from './graph/render';

// import AlgoNode from './shape/nodes/AlgoNode'
// import { demoData as chartData, nodeStatusList } from './data'
import { ACTUATOR_LIST2 } from './constants';
import { AlgoNodeContextMenuContent } from './graph/config-node-contextmenu';

// import { XflowApi } from '@/services/xflow'
import {
  get_processor,
  get_workflow_info,
  update_workflow,
  add_node,
  delete_node,
} from '@/services/workflow';
import { BaseLodashEs } from '@/utils';
import {
  get_w_h,
  get_graph_option,
  getStencilList,
  filter_graphic_cells,
  createNodeInstance,
  createEdgeInstance,
} from './utils';

import { nodeContextMenuItems } from './constants';

// import './index.less'
import './styles/style.less';
import { Menu, Dropdown, message } from 'antd';

// 更新流程图模块tab
import { connect } from 'react-redux';
import { UPDATE_TABS_WORKFLOW } from '@/store/action_type';
// import useReduxTools from '@/utils/reduxWorkflow';
/**
 * =================================== DagChart ===================================
 */
export class DagChart extends React.Component<any> {
  private container: HTMLDivElement;
  private graphInstance: any;
  private stencilContainer: any;

  private evt: any; // 目标事件
  private contextMenuType: string;
  private celldetail: string; // 操作目标对象【节点|连线】

  private targetTab: any; // 打开的标签页信息
  private workflowData: any; // 当前操作任务流 workflowData 数据保存
  private graphData: any; // 当前操作任务流 workflowData dag图数据保存
  private nodeInfo: any; // 当前操作的节点cell临时数据保存

  // private flowchartHook: string = 'flowchart_hook_' + this.props.targetTab.tabkey; // 图的父级
  private flowchartHook: string = 'flowchart_hook_' + this.props.tabkey; // 图的父级
  private hookGraph: string = BaseLodashEs.lodash_uniqueId('graph_canvasid_'); // 挂载图的html元素
  private hookMinimap: string =
    BaseLodashEs.lodash_uniqueId('graph_minimapid_');
  private hookToolbar: string =
    BaseLodashEs.lodash_uniqueId('graph_toolbarid_');
  private hookStencil: string =
    BaseLodashEs.lodash_uniqueId('graph_stencilid_');

  componentDidMount() {
    this.targetTab = this.props;
    this.init_graph();
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  init_graph = async () => {
    // console.log('this.targetTab', this.targetTab)
    const { width, height } = get_w_h(this.flowchartHook);
    const result = (await get_workflow_info({
      workflowId: this.targetTab.node.key,
    })) as any;
    const workflowData = (this.workflowData = result.data.obj);

    const graph = (this.graphInstance = new GraphFactory({
      container: this.container, //document.getElementById(this.hookGraph),
      width,
      height,
      grid: true,
      panning: {
        enabled: true,
        // eventTypes: ['leftMouseDown', 'mouseWheel'],
      },

      // autoResize: true, // 监听容器大小改变，并自动更新画布大小。
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
          return magnet.getAttribute('port-group') !== 'top';
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
          });
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
      translating: {
        restrict: false, // 配置节点的可移动区域，默认值为 false.  节点、边的移动，不可超过画布
      },
      scaling: {
        min: 0.5,
        max: 2,
      },
      minimap: {
        enabled: true,
        container: document.getElementById(this.hookMinimap),
        width: 110,
        height: 110,
        padding: 0,
        scalable: true,
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
              return null;
            }
          },
        },
      },
    })); // ------------ graph option end ------------
    this.init_stencil(); // 初始化执行器

    this.graphData = workflowData.dag;
    // ①
    // renderCustomCells(graph, workflowData.dag)
    // 或②
    const _rendNodes = workflowData.dag.nodes || [];
    const _rendEdges = workflowData.dag.edges || [];
    // console.log(12345, _rendNodes, _rendEdges)
    _rendNodes.forEach((metadata) => this.renderNode(metadata));
    // _rendEdges.forEach((metadata) => this.renderEdge(metadata))

    graph.centerContent();

    this.bind_event(graph);
  };
  /**
   * 渲染 自定义节点
   * metadata: 通过 filter_response_dagdata 得到的节点数据，无shape、ports等绘图样式信息
   * { id, instanceId, nodeId, jobId, label, languageType, processorType, nodeName, nodeType, runStatus, status, x, y, }
   */
  renderNode(metadata) {
    // if (!this.graphInstance) return false

    const cIns = createNodeInstance(this.graphInstance!, metadata); // 创建新节点, meta:节点元数据。
    return this.graphInstance!.addNode(cIns); // 添加新节点到画布，返回添加的节点
  }
  /**
   * 渲染 自定义边
   */
  renderEdge(metadata) {
    // if (!this.graphInstance) return false createEdgeInstance
    // const cIns = createEdgeInstance(this.graphInstance!, metadata) // 创建新节点, meta:节点元数据。

    return this.graphInstance!.addEdge(metadata);
  }
  /**
   * graph 事件绑定
   * @param graph 实例
   */
  bind_event = (graph) => {
    const _that = this;
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
      }
    };
    // ########################### 节点事件 监听 ###########################
    // 鼠标移入事件
    graph.on('node:mouseenter', ({ cell, e }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const container = document.getElementById(this.hookGraph)!;
      const ports = container.querySelectorAll(
        '.x6-port-body'
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true); // true or false

      // 添加tools【移入效果 | ports | 右键菜单】
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'algonode-contextmenu',
            args: {
              graphContainer: graph,
              menu: AlgoNodeContextMenuContent, // antd menu element
              nodedata: cell?.getData(),
              onHide() {
                cell.removeTools();
              },
              handleClick(command) {
                _that.handleContextClick(command, cell.data);
              },
            },
          },
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#3370ff',
                stroke: '#666',
                'stroke-width': 1,
                'fill-opacity': 0.06,
              },
            },
          },
        ]);
      }
    });

    // 鼠标移入事件
    graph.on('node:mouseleave', ({ cell }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const container = document.getElementById(this.hookGraph)!;
      const ports = container.querySelectorAll(
        '.x6-port-body'
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);

      cell.removeTools(); // 可移除【移入效果 | ports】
    });

    // 节点平移
    graph.on('node:moved', ({ cell }) => {
      const nodeData = cell.data;
      const { x, y } = cell.position();
      nodeData.x = x;
      nodeData.y = y;

      // 查找并替换为移动位置后的节点
      const _nodes = this.graphData.nodes;
      const _index = _nodes.findIndex(
        (item) => item.nodeId === nodeData.nodeId
      );
      _nodes[_index] = nodeData;

      this.graphData.nodes = _nodes;
      this.save_graphic();
    });

    // ########################### 边事件 监听 ###########################
    /**
     * 当拖动边的起始/终止箭头将边连接到节点/边或者将边从节点/边上分离后触发 edge:connected
     * 更改已有连线的起终点或新增连线
     */
    graph.on('edge:connected', ({ isNew, edge }) => {
      debugger;
      if (isNew) {
        // 是新增的连线
        // edge.attr({ line: {  strokeDasharray: '' }})
        // edge.attrs('line/strokeDasharray', '') // 错误写法
        // 更新graphData, 并将新增连线添加至数据库
        // this.add_edge(edge)
        const source = edge.getSourceCell();
        const targrt = edge.getSourceCell();
        this.save_graphic();
      }
    });
  };

  /**
   * 执行器
   * @returns
   */
  init_stencil = async () => {
    const that = this;

    // const rst = await XflowApi.loadNodePaneData()
    const rst = await get_processor();
    if (!rst.status) return false;
    const actuatorList =
      rst.data.list.length > 0 ? rst.data.list : ACTUATOR_LIST2; // ACTUATOR_LIST2静态执行器列表

    if (actuatorList.length === 0) return false;
    const _groups = getStencilList(this.graphInstance, actuatorList);
    const _stencil = new AddonFactory.Stencil({
      animation: false,
      // name: '执行器列表', // 分组标题，缺省时使用 `name`
      title: '执行器列表', // 分组标题，缺省时使用 `name`
      target: this.graphInstance, // 目标画布
      scaled: true, // 添加的节点是否根据画布缩放
      collapsable: false, // 分组是否可折叠
      // collapsed: true, // 初始状态是否为折叠状态
      stencilGraphPadding: 20,
      stencilGraphWidth: 200,
      stencilGraphHeight: 620,

      groups: _groups.set, // this.stencilData, // 分组信息
      // search: false, // 搜索选项
      // placeholder: '按节点名称搜索',
      // notFoundText: '-- 暂无 --',
      // validateNode: null, // 拖拽结束时，验证节点是否可以放置到目标画布中。支持异步验证
      // containerParent: null, // 拖拽容器挂载在哪个父节点下面
      layoutOptions: {
        columns: 1,
        columnWidth: 100,
        rowHeight: 48,
        dx: 0, // 单元格在 X 轴的偏移量，默认为 10。
        dy: 0, // 单元格在 Y 轴的偏移量，默认为 10。
        marginX: 10,
        marginY: 14,
        center: false, // 节点是否与网格居中对齐，默认为 true。
        resizeToFit: false, // 是否自动调整节点的大小来适应网格大小，默认为 false
      },
      // getDragNode(sourceNode, options) {
      //   return sourceNode.clone()
      // },
      // getDropNode(draggingNode, options) { // 获取代理节点
      //   return draggingNode.clone()
      // },
      validateNode(draggingNode, options) {
        const { x, y } = draggingNode.position();

        draggingNode.data.x = x;
        draggingNode.data.y = y;

        // 1. 拼装 新节点的数据
        that.assemble_node_data(draggingNode);
        return false; // true: 立即绘制至canvas, 需要更改节点名称等信息，需在调用添加接口返回后成功后更新节点ID等数据，进行绘制。
      },
    });

    // 挂载
    this.stencilContainer = document.getElementById(this.hookStencil);
    this.stencilContainer.appendChild(_stencil.container);
    // 加载组内子节点, 初始化可添加的节点图形
    for (let i = 0; i < _groups.set.length; i++) {
      _stencil.load(_groups.children[i], _groups.set[i].name);
    }
  };

  handleContextClick(command, nodeData) {
    // console.log('handleContextClick---', command, nodeData);
    if (!command) return false;
    switch (command) {
      case nodeContextMenuItems.nodeOpen.key:
        this.node_open_in_tabs(nodeData);
        break;
      case nodeContextMenuItems.nodeDelete.key:
        this.node_delete(nodeData);
        break;
      default:
        break;
    }
  }

  /**
   * 打开节点，展示在标签页中
   */
  node_open_in_tabs(nodeData) {
    const _ty = nodeData.languageType ? nodeData.languageType : nodeData.type;
    const _data: BASETP.WorkflowTabsType = {
      tabkey: uuid_str(),
      tabtitle: nodeData.nodeName,
      tabtype: _ty,

      key: nodeData.nodeId,
      type: nodeData.nodeType,
      language: _ty,
      title: nodeData.nodeName,
      icon: nodeData.icon,
      node: nodeData, // 节点全部信息
    };

    // 调用dispatch action
    const { insertToTabs } = this.props;
    insertToTabs(_data);
  }
  /**
   * 删除节点
   */
  async node_delete(nodeData) {
    // const result: any = await delete_node(nodeData.jobId, nodeData.nodeType)
    const result: any = await delete_node({
      jobId: nodeData.jobId,
      nodeType: nodeData.nodeType || undefined,
    });
    if (!result.status) {
      message.error('节点删除失败');
      return false;
    }

    const _nodes = this.graphData.nodes;
    const _index = _nodes.findIndex((item) => item.nodeId === nodeData.nodeId);

    _nodes.splice(_index, 1);
    this.graphData.nodes = _nodes;
    this.save_graphic();
    this.graphInstance.removeNode(_nodes.id);
  }
  /**
   * // 打开 添加编辑节点弹窗
   * 2. 整理出保存所需的节点数据
   *
   * cell: draggingNode 图形
   */
  assemble_node_data = (cell) => {
    // const _node = cell?.getData()
    const _node = cell.data;
    console.log('assemble_node_data: _node', _node);
    const _t = new Date().getTime().toString();
    // 新增节点的名称
    const _showName =
      _node.processorName + '_' + _t.substring(_t.length - 10, _t.length);

    const newNodeInfo = {
      forJobAdd: {
        // /job/add 独立添加节点的接口，需要传送的数据
        nodeName: _showName,
        workflowId: this.workflowData.workflowId, // 所属的任务流的id
        jobExecuteConfig: {
          executeType: 1, // 执行类型，1-内建，2-外置（动态加载）
          processorType: _node.processorType,
          processorInfo: _node.processorInfo,
        },
      },

      forDagAdd: {
        // SdpGraph.NodeType
        instanceId: null,
        jobId: null,
        nodeId: null,

        languageType: _node.languageType,
        nodeType: _node.processorType,
        nodeName: _showName,
        runStatus: null,
        status: null,

        x: _node.x,
        y: _node.y,
        id: null,
        label: _showName,
      },
    };

    this.node_create_commit(BaseLodashEs.cloneDeep(newNodeInfo));
  };
  /**
   * 3. 发送至后端。提交 新建 节点
   * 添加成功后，调用add_item绘制到图内，在通过 save_graphic 保存任务流图信息
   */
  async node_create_commit(nodeinfo) {
    const rst = await add_node(nodeinfo.forJobAdd);

    if (!rst.status) {
      console.warn('添加节点失败');
      return false;
    }
    const resultIds = { ...rst.data.obj };
    const _dagNodeData: SdpGraph.NodeType = {
      ...nodeinfo.forDagAdd,

      jobId: resultIds.jobId,
      nodeId: resultIds.nodeId,
      id: resultIds.nodeId,
    };

    this.render_new_cell_to_canvas(_dagNodeData);
    // // graphData 中无需id\label, 不删发送到后端也会被忽略
    // delete _dagNodeData.id
    // delete _dagNodeData.label
    this.graphData.nodes.push(_dagNodeData); // metadata

    this.save_graphic(); // 新增连线可在保存中从getCells()获取
  }
  /**
   * 4. 添加新节点，接口返回成功后，获取新的节点ID，绘制至画布
   *    并调用save_graphic，将图上的节点、连线收集，存为dag 信息，提交任务流接口
   * @param nodeinfo
   */
  render_new_cell_to_canvas = (nodeinfo) => {
    if (!this.graphInstance) return false;
    this.renderNode(nodeinfo); // 绘制新增节点

    // this.save_graphic() // 新增连线可在保存中从getCells()获取
  };

  /**
   * 任务流图 执行任意图节点、连线操作后 保存
   * 保存各命令执行后更新的graphicData数据
   */
  async save_graphic() {
    // const graphicData = this.graphInstance.getCells() // 返回画布中所有节点和边
    // const _filterData = filter_graphic_cells(BaseLodashEs.cloneDeep(graphicData)) // 将节点、连线更改为后台所需格式

    // this.graphData = _filterData // 更新图数据

    const _par = { workflowId: this.targetTab.node.key, dag: this.graphData };

    const rst = await update_workflow(_par);

    if (!rst.status) {
      console.warn('更新任务流 dag 失败');
      return false;
    }
  }

  render() {
    // const { insertToTabs } = this.props
    return (
      <div
        className="module-custom-main module-flowchart"
        id={this.flowchartHook}
      >
        <MySplitPane
          className="pane_root_hook"
          split="vertical"
          defaultSize={206}
          maxSize={300}
          primary="first"
        >
          <MyPane className="pane_stencil_hook">
            <div id={this.hookStencil} className="stencil_wrap" />
          </MyPane>

          <MyPane className="pane_paint_hook">
            {/* <p className="draw_toolbar"> 图 操作按钮组</p>  */}
            <div className="draw_minimap" id={this.hookMinimap} />
            <div
              className="draw_graph"
              ref={this.refContainer}
              id={this.hookGraph}
            />
          </MyPane>

          {/* <useReduxTools ref={this.useReduxToolsRef}/>  */}
        </MySplitPane>
      </div>
    );
  }
} // class end

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch) => ({
  insertToTabs: (nodedata) =>
    dispatch({
      type: UPDATE_TABS_WORKFLOW,
      payload: {
        params: {
          operation: 'add',
          data: { ...nodedata },
        },
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DagChart as any);
