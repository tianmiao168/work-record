import React from 'react'
import { Node } from '@antv/x6'
import '@antv/x6-react-shape'
import './index.less'

interface NodeStatus {
  id: string
  status: 'default' | 'success' | 'failed' | 'running'
  showStatus?: boolean

  label?: string
  width?: number
  height?: number
}
import { NODE_WIDTH, NODE_HEIGHT } from '../../constants'

const image = {
  logo: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
  success:
    'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ',
  failed:
    'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ',
  running:
    'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ',
}

/**
 * 当前该组件被canvas、minimap调用
 */
export default class AlgoNode extends React.Component<{ node?: Node }> {
  shouldComponentUpdate() {
    const { node } = this.props
    // console.log('algo node: ', node)
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }
    return false
  }

  render() {
    const { node } = this.props
    const data = node?.getData() as NodeStatus

    const { label, status = 'default', showStatus = false } = data
    // console.log('algo node: ', data)
    // 保持新增节点的尺寸，与画布已有节点尺寸一致
    //  style={wrapStyle}
    // const wrapStyle = {
    //   width: width || NODE_WIDTH,
    //   height: height || NODE_HEIGHT,
    //   lineHeight: height || NODE_HEIGHT,
    // }

    return (
      <div className={`algo-node-wrapper ${status}`} >
        <img src={image.logo} />
        <span className="label">{label}</span>
        {
          showStatus && <span className="status">
          {status === 'success' && <img src={image.success} />}
          {status === 'failed' && <img src={image.failed} />}
          {status === 'running' && <img src={image.running} />}
        </span>
        }
      </div>
    )
  }
}