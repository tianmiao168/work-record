
import React from 'react'
import ReactDom from 'react-dom'
import { Menu, Dropdown, Divider } from 'antd'
import type { MenuProps } from 'antd';
import { ToolsView, EdgeView, NodeView } from '@antv/x6'
import './menu.less'
import { nodeContextMenuItems } from '../constants'

// const items: MenuProps['items'] = [
//   {
//     label: '打开节点',
//     key: 'nodeOpen',
//   },
//   {
//     label: '运行',
//     key: 'nodeRun',
//   },
//   {
//     label: '停止运行',
//     key: 'nodeRunStop',
//   },
// ];

/**
 * graph.addNode({
 * tools: [{ name: 'contextmenu', args: {AlgoNodeContextMenuContent} }
 */
// const onMenuClick = (e: any) => {
//   // console.log('1222222, menu click ', e)
// }
// const handle_delete_node = (e: any) => {
//   // console.log(' handle_delete_node ', e.target)
// }

export const AlgoNodeContextMenuContent: MenuProps['items'] = [
  {
    key: nodeContextMenuItems.nodeOpen.key,
    label: <span>{nodeContextMenuItems.nodeOpen.label}</span>,
    disabled: nodeContextMenuItems.nodeOpen.disabled,
  },
  {
    type: 'divider',
  },
  // {
  //   key: nodeContextMenuItems.nodeRun.key,
  //   label: nodeContextMenuItems.nodeRun.label,
  //   disabled: nodeContextMenuItems.nodeRun.disabled,
  // },
  // {
  //   key: nodeContextMenuItems.nodeRunStop.key,
  //   label: nodeContextMenuItems.nodeRunStop.label,
  //   disabled: nodeContextMenuItems.nodeRunStop.disabled,
  // },
  // {
  //   key: nodeContextMenuItems.nodeRunRestore.key,
  //   label: nodeContextMenuItems.nodeRunRestore.label,
  //   disabled: nodeContextMenuItems.nodeRunRestore.disabled,
  // },
  // {
  //   type: 'divider',
  // },
  {
    key: nodeContextMenuItems.nodeDelete.key,
    label: nodeContextMenuItems.nodeDelete.label,
    disabled: nodeContextMenuItems.nodeDelete.disabled,
  },
];




export default class AlgoNodeContextMenuTool extends ToolsView.ToolItem<
  NodeView,
  ContextMenuToolOptions
> {
  private knob: HTMLDivElement
  private timer: number
  // private cellData: any // 目标节点的数据
  private command: string // 被点击的菜单命令

  render() {
    // this.cellData = this.options.nodedata
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }

    return this
  }

  private handleMenuClick = (e: any) => {
    console.log('e.key', e.key)
    this.command = e.key
  }
  private toggleContextMenu(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)
    document.removeEventListener('mousedown', this.onMouseDown)
    if (visible) {
      const items = (AlgoNodeContextMenuContent || []) as MenuProps["items"]
      ReactDom.render(
        <Dropdown
          open={true}
          trigger={['contextMenu']}
          menu={{
            items,
            onClick: this.handleMenuClick,
          }}
          overlayClassName='sdp-graph-node-dropdown-menu'
        >
          <a onClick={(e) => e.preventDefault() } />
        </Dropdown>,
        this.knob,
      )
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style
    if (e) {
      const pos = this.graph.clientToGraph(e.clientX, e.clientY)
      style.left = `${pos.x}px`
      style.top = `${pos.y}px`
    } else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }


  private onMouseDown = () => {
    this.timer = window.setTimeout(() => {
      this.updatePosition()
      this.toggleContextMenu(false)
      if (this.options.handleClick) { // 外部传入的click的响应
        this.options.handleClick.call(this, this.command) // , this.cellData
      }
      if (this.options.onHide) { // 外部传入的click的响应
        this.options.onHide.call(this)
      }
    }, 200)
  }

  private onContextMenu({ e }: { e: MouseEvent }) {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }
    this.updatePosition(e)
    this.toggleContextMenu(true)
  }

  delegateEvents() {
    this.cellView.on('cell:contextmenu', this.onContextMenu, this)
    return super.delegateEvents()
  }

  protected onRemove() {
    this.cellView.off('cell:contextmenu', this.onContextMenu, this)
  }
}

AlgoNodeContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  graphContainer: HTMLElement | SVGElement
  graphInstance: HTMLElement | SVGElement
  menu: React.ReactElement
  nodedata: any
  handleClick: (this: AlgoNodeContextMenuTool, op) => void
  onHide: (this: AlgoNodeContextMenuTool) => void
}

// Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
// Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
