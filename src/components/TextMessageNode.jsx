import { Handle, Position } from 'reactflow'

export default function TextMessageNode({ data }) {
  return (
    <div className="text-node">
      <div className="text-node-header">Message</div>
      <div className="text-node-body">{data?.text || 'New message'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
