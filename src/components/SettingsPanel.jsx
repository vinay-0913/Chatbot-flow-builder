export default function SettingsPanel({ selectedNode, onTextChange, onBack }) {
  return (
    <div className="panel">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <h2>Message Settings</h2>
      <label htmlFor="messageText">Text</label>
      <textarea
        id="messageText"
        value={selectedNode?.data?.text ?? ''}
        onChange={(event) => onTextChange(event.target.value)}
        rows={8}
      />
    </div>
  )
}
