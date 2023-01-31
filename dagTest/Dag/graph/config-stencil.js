import React from "react";

export default class Stencil extends React.Component {

      /**
     * 初始化 Stencil & Shape
     * 1.获取执行器数据
     * 2.生成节点实例, 组合为stencil.groups所需
     * 3.创建stencil，并挂载stencil.groups分组信息
     * 4.load加载分组子节点,挂载至子节点上
     */
    async initStencilAndShape() {
      const { actuatorList } = this.props
      
      const _groups = getStencilList(actuatorList)
      // console.log('actuatorList _groups', _groups)
      const _stencil = new AddonFactory.Stencil({
        animation: false,
        // name: '执行器列表', // 分组标题，缺省时使用 `name`
        title: '执行器列表', // 分组标题，缺省时使用 `name`
        target: this.baseGraph, // 目标画布
        scaled: true, // 添加的节点是否根据画布缩放
        collapsable: false, // 分组是否可折叠
        collapsed: true, // 初始状态是否为折叠状态
        stencilGraphPadding: 0,
        stencilGraphWidth: 120,
        stencilGraphHeight: 520,
        
        groups: _groups.set, // this.stencilData, // 分组信息
        // search: false, // 搜索选项
        // placeholder: '按节点名称搜索',
        // notFoundText: '-- 暂无 --',
        // validateNode: null, // 拖拽结束时，验证节点是否可以放置到目标画布中。支持异步验证
        // containerParent: null, // 拖拽容器挂载在哪个父节点下面
        layoutOptions: {
          columns: 1,
          columnWidth: 100,
          rowHeight: 42,
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
          const { x, y } = draggingNode.position()

          draggingNode.data.x = x
          draggingNode.data.y = y

          that.node_create(draggingNode)
          return false
        }
      })

      // this.stencilContainer = _stencil
      // 挂载
      this.stencilContainer = document.getElementById(this.hookStencil)
      this.stencilContainer.appendChild(_stencil.container)

      // 加载组内子节点, 初始化可添加的节点图形
      for (let i = 0;  i <  _groups.set.length; i++ ) {
        _stencil.load(_groups.children[i], _groups.set[i].name)
      }
    },

    render () {
      return ()
    }
}