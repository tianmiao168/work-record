export const SDP_DAG_DND_RENDER_ID = 'DND_NDOE'
export const GROUP_NODE_RENDER_ID = 'GROUP_NODE_RENDER_ID'
export const NODE_WIDTH = 180
export const NODE_HEIGHT = 36

// sdp dag节点props
export const SDP_DAG_NODE_COMMON_PROPS = {
  // renderKey: SDP_DAG_DND_RENDER_ID,
  shape:'dag-node',
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
} as const

/**
 * 节点锚点位置：上/下/左/右
 */
export enum SdpAnchorPosition {
  TOP = "top",
  BOTTOM = "bottom",
  RIGHT = "right",
  LEFT = "left"
}
/**
 * 锚点类型： 输入/输出
 */
export enum SdpAnchorType {
  INPUT = "input",
  OUTPUT = "output"
}

/**
 * 节点的锚点类型、位置设置
 */
export const SdpPortItems = [
  {
    type: SdpAnchorType.INPUT,
    group: SdpAnchorPosition.TOP,
    tooltip: '输入桩1',
  },
  {
    type: SdpAnchorType.OUTPUT,
    group:SdpAnchorPosition.BOTTOM,
    tooltip: '输出桩',
  },
]

/**
 * 保存图数据
 */
export const SAVE_GRAPH_DATA = 'saveGraphData'

/**
 * 节点的右键菜单，可选项
 */
export const nodeContextMenuItems = {
  nodeOpen: { key: 'nodeOpen', label: '打开节点', disabled: false, icon: '' },
  nodeRun: { key: 'nodeRun', label: '运行', disabled: true, icon: '' },
  nodeRunStop: { key: 'nodeRunStop', label: '暂停（冻结）', disabled: true, icon: '' },
  nodeRunRestore: { key: 'nodeRunRestore', label: '恢复（解冻）', disabled: true, icon: '' },
  nodeDelete: { key: 'nodeDelete', label: '删除节点', disabled: false, icon: '' },
}

/**
 * 执行器
 */
export const ACTUATOR_LIST2 = [{
  groupName: '任务节点',
  groupId: 7,
  processorList: [{
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Mysql节点',
      processorType: 'mysql',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-mysql-logo',
      color: null,
      languageType: 'sql'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Hive节点',
      processorType: 'hive',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-hive-logo',
      color: null,
      languageType: 'sql'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Impala节点',
      processorType: 'impala',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-impala-logo',
      color: null,
      languageType: 'sql'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'shell节点',
      processorType: 'shell',
      processorInfo: 'tech.powerjob.official.processors.impl.script.ShellProcessor',
      logoContent: 'icon-cloudshellyunminglinghang-copy',
      color: null,
      languageType: 'shell'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'python节点',
      processorType: 'python',
      processorInfo: 'tech.powerjob.official.processors.impl.script.PythonProcessor',
      logoContent: 'icon-python-logo\r\n',
      color: null,
      languageType: 'python'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'http节点',
      processorType: 'http',
      processorInfo: 'tech.powerjob.official.processors.impl.HttpProcessor',
      logoContent: 'icon-shangchuan',
      color: null,
      languageType: 'http'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: '离线同步',
      processorType: 'offlineEtl',
      processorInfo: 'tech.powerjob.official.processors.impl.script.PythonProcessor',
      logoContent: 'icon-datax-logo',
      color: null,
      languageType: 'etl'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: '实时同步',
      processorType: 'realTimeEtl',
      processorInfo: 'tech.powerjob.official.processors.impl.script.PythonProcessor',
      logoContent: 'icon-realtime-logo',
      color: null,
      languageType: 'etl'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Flink SQL',
      processorType: 'flinkSql',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-flinkx-logo',
      color: null,
      languageType: 'sql'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Spar SQL',
      processorType: 'sparkSql',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-flinkx-logo',
      color: null,
      languageType: 'sql'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Flink JAR',
      processorType: 'flinkJar',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-all-jar',
      color: null,
      languageType: 'jar'
    },
    {
      groupId: 7,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Spark JAR',
      processorType: 'sparkJar',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-all-jar',
      color: null,
      languageType: 'jar'
    },
  ]
},
{
  groupName: '控制节点',
  groupId: 8,
  processorList: [
    {
      groupId: 8,
      groupName: '控制节点',
      sourceType: 1,
      processorName: '分之节点',
      processorType: 'subProcess',
      processorInfo: 'tech.powerjob.official.processors.impl.HttpProcessor',
      logoContent: 'icon-subProcess-logo',
      color: null,
      languageType: 'sub'
    },
    {
      groupId: 8,
      groupName: '任务节点',
      sourceType: 1,
      processorName: 'Map Reduce',
      processorType: 'mapReduce',
      processorInfo: 'tech.powerjob.official.processors.impl.sql.DynamicDatasourceSqlProcessor',
      logoContent: 'icon-map-reduce',
      color: null,
      languageType: 'sql'
    },
  ]
}
]
