export default function NodesPanel({ nodeCatalog }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="panel">
      <h2>Nodes Panel</h2>
      <p>Drag a node to the canvas</p>
      <div className="node-list">
        {nodeCatalog.map((node) => (
          <div
            key={node.type}
            className="draggable-node"
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  )
}
