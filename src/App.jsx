import { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { NODE_CATALOG } from './config/nodeCatalog'
import TextMessageNode from './components/TextMessageNode'
import NodesPanel from './components/NodesPanel'
import SettingsPanel from './components/SettingsPanel'

const initialNodes = []
const initialEdges = []

const flowNodeTypes = {
  text: TextMessageNode,
}

let nodeIdCounter = 1
const getNodeId = () => `node_${nodeIdCounter++}`

function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [saveError, setSaveError] = useState('')

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const onConnect = useCallback(
    (params) => {
      const sourceAlreadyConnected = edges.some((edge) => edge.source === params.source)

      if (sourceAlreadyConnected) {
        setSaveError('Each message can only have one outgoing connection.')
        return
      }

      setSaveError('')
      setEdges((eds) => addEdge(params, eds))
    },
    [edges, setEdges],
  )

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode = {
        id: getNodeId(),
        type,
        position,
        data: { text: 'New message' },
      }

      setNodes((nds) => nds.concat(newNode))
      setSaveError('')
    },
    [setNodes],
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    setSelectedNodeId(selectedNodes[0]?.id ?? null)
  }, [])

  const onTextChange = useCallback(
    (text) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  text,
                },
              }
            : node,
        ),
      )
    },
    [selectedNodeId, setNodes],
  )

  const onSave = useCallback(() => {
    const nodesWithoutIncoming = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id),
    )

    if (nodes.length > 1 && nodesWithoutIncoming.length > 1) {
      setSaveError('Cannot save flow: more than one node is missing an incoming edge.')
      return
    }

    setSaveError('')
    // Persist flow payload in whatever backend/store is needed. Console log for now.
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ nodes, edges }, null, 2))
  }, [edges, nodes])

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Chatbot Flow Builder</h1>
        <button type="button" className="save-btn" onClick={onSave}>
          Save Changes
        </button>
      </header>

      <main className="content">
        <section className="canvas-wrap" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={flowNodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </section>

        <aside className="right-panel">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onTextChange={onTextChange}
              onBack={() => setSelectedNodeId(null)}
            />
          ) : (
            <NodesPanel nodeCatalog={NODE_CATALOG} />
          )}

          {saveError ? <div className="error-banner">{saveError}</div> : null}
        </aside>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  )
}
