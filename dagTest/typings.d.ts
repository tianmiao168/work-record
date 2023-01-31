
declare namespace SdpGraph {

  export interface NodeType {
    instanceId: number; // int64实例ID，可为null
    jobId: number; // int64任务ID
    nodeId: number; // int64节点id

    languageType: string; // 语言类型 父类【sql(mysql、sql、impala、)， Python(python2, python3)】
    nodeType: string; // 节点类型
    nodeName: string; // 节点名称，默认和任务名称相同
    runStatus: number; // int32运行状态，每次查询需要去实例中获取
    status: number; // int32节点状态，具体状态见状态枚举类

    x: number; // int32横坐标
    y: number; //int32纵坐标

    // x6节点绘制需要的数据
    id?: number; // int64节点id
    label: string; // 节点名称，默认和任务名称相同
  }
}