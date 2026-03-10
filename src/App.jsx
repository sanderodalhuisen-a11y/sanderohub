import { useEffect, useMemo, useState } from 'react'
import './App.css'

const tabs = ['Chat', 'Tasks', 'Projects', 'Memory']
const actions = ['summarize', 'create_task', 'draft_message']

const initialTasks = [
  {
    id: 1,
    title: 'Prepare simplified MVP walkthrough',
    status: 'Ready',
    source: 'create_task',
  },
  {
    id: 2,
    title: 'Trim extra sections from the prototype',
    status: 'Done',
    source: 'create_task',
  },
]

const projects = [
  {
    name: 'Sandero Hub MVP',
    summary: 'Single-app prototype with exactly four tabs and three exposed actions.',
    focus: 'Demonstrate the shape of the product without backend integrations yet.',
  },
  {
    name: 'Twin API backend',
    summary: 'Thin Express layer for input intake, context retrieval, OpenClaw calls, and n8n webhooks.',
    focus: 'Turns the demo into an integration-ready product skeleton.',
  },
]

const memories = [
  'Sander prefers direct, low-clutter tooling.',
  'The current MVP should stay demo-safe with lightweight mock behavior.',
  'Only summarize, create_task, and draft_message are exposed concepts for now.',
]

const initialChat = [
  {
    id: 1,
    role: 'assistant',
    label: 'Sandero Hub',
    text: 'This MVP stays intentionally small: four tabs, three actions, and now a thin Twin API backend layer.',
  },
  {
    id: 2,
    role: 'user',
    label: 'You',
    text: 'What can I show in the demo right now?',
  },
]

function makeSummary(text) {
  const cleaned = text.trim()

  if (!cleaned) {
    return 'Add a few lines of context and summarize will return a short mock brief.'
  }

  const normalized = cleaned.replace(/\s+/g, ' ')
  const preview = normalized.length > 140 ? `${normalized.slice(0, 140)}…` : normalized
  return `Mock summary: ${preview}`
}

function App() {
  const [activeTab, setActiveTab] = useState('Chat')
  const [chatInput, setChatInput] = useState('')
  const [summaryInput, setSummaryInput] = useState(
    'Team sync notes: simplify the product demo, keep the interface small, and show only the core assistant actions.'
  )
  const [summaryOutput, setSummaryOutput] = useState(makeSummary(summaryInput))
  const [taskTitle, setTaskTitle] = useState('Draft the MVP demo script')
  const [taskList, setTaskList] = useState(initialTasks)
  const [draftContext, setDraftContext] = useState('Ask the team for feedback on the simplified four-tab MVP.')
  const [draftMessage, setDraftMessage] = useState(
    'Draft message: Hi team — I simplified Sandero Hub to four tabs and three clear actions for the MVP. Please review the latest build and share feedback on what feels most useful.'
  )
  const [chatMessages, setChatMessages] = useState(initialChat)
  const [twinInput, setTwinInput] = useState('Summarize the latest product direction and prep a follow-up workflow.')
  const [triggerWorkflow, setTriggerWorkflow] = useState(false)
  const [twinResult, setTwinResult] = useState(null)
  const [apiHealth, setApiHealth] = useState({ status: 'checking' })
  const [apiLoading, setApiLoading] = useState(false)

  const nextTaskId = useMemo(
    () => (taskList.length ? Math.max(...taskList.map((task) => task.id)) + 1 : 1),
    [taskList]
  )

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setApiHealth({ status: 'online', data })
      } catch {
        setApiHealth({
          status: 'offline',
          data: { message: 'Twin API offline. Start the backend to enable live calls.' },
        })
      }
    }

    loadHealth()
  }, [])

  function handleSummarize() {
    const result = makeSummary(summaryInput)
    setSummaryOutput(result)
    setChatMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        role: 'assistant',
        label: 'Sandero Hub',
        text: `summarize → ${result}`,
      },
    ])
    setActiveTab('Chat')
  }

  function handleCreateTask() {
    const cleanTitle = taskTitle.trim() || 'Untitled follow-up'
    const newTask = {
      id: nextTaskId,
      title: cleanTitle,
      status: 'Ready',
      source: 'create_task',
    }

    setTaskList((current) => [newTask, ...current])
    setTaskTitle('')
    setChatMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        role: 'assistant',
        label: 'Sandero Hub',
        text: `create_task → Added “${cleanTitle}” to the Tasks tab.`,
      },
    ])
    setActiveTab('Tasks')
  }

  function handleDraftMessage() {
    const cleanContext = draftContext.trim() || 'Follow up on the simplified MVP.'
    setDraftMessage(
      `Draft message: Hi team — quick update on Sandero Hub. ${cleanContext} This is still mock/demo behavior, so agenda, mail, document analysis, proactive suggestions, day start/day end, and dashboards are intentionally deferred for now.`
    )
    setChatMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        role: 'assistant',
        label: 'Sandero Hub',
        text: 'draft_message → Prepared a lightweight draft you can copy from the composer panel.',
      },
    ])
    setActiveTab('Projects')
  }

  function handleSendChat() {
    const clean = chatInput.trim()
    if (!clean) return

    setChatMessages((current) => [
      ...current,
      { id: current.length + 1, role: 'user', label: 'You', text: clean },
      {
        id: current.length + 2,
        role: 'assistant',
        label: 'Sandero Hub',
        text: 'Chat is still a lightweight surface in this MVP. Use summarize, create_task, draft_message, or the Twin API card to demo the current product shape.',
      },
    ])
    setChatInput('')
  }

  async function handleTwinQuery() {
    setApiLoading(true)

    try {
      const response = await fetch('/api/twin/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: twinInput, triggerWorkflow }),
      })

      const data = await response.json()
      setTwinResult(data)
      setChatMessages((current) => [
        ...current,
        {
          id: current.length + 1,
          role: 'assistant',
          label: 'Twin API',
          text: `Twin API → ${data.reply}`,
        },
      ])
      setActiveTab('Chat')
    } catch {
      setTwinResult({
        ok: false,
        reply: 'Twin API request failed. Start the backend or check the Replit run command.',
      })
    } finally {
      setApiLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-card">
            <div className="brand-mark">S</div>
            <div>
              <p className="eyebrow">Replit-ready MVP</p>
              <h1>Sandero Hub</h1>
            </div>
          </div>

          <nav className="nav-list" aria-label="Main navigation tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer card mini-card">
          <p className="eyebrow">Current scope</p>
          <strong>UI + Twin API foundation</strong>
          <ul>
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
            <li>twin_api</li>
          </ul>
        </div>
      </aside>

      <main className="dashboard">
        <section className="hero-panel card">
          <div>
            <p className="eyebrow">Reduced product shape</p>
            <h2>Exactly four tabs. Three demo actions. One thin backend layer.</h2>
            <p className="hero-copy">
              Sandero Hub now includes a small Twin API backend that can receive app input,
              build context, call OpenClaw, trigger n8n webhooks, and return results to the UI.
            </p>
          </div>
          <div className="hero-pills" aria-label="Exposed actions">
            {actions.map((action) => (
              <span key={action} className="badge">
                {action}
              </span>
            ))}
            <span className="badge">twin_api</span>
          </div>
        </section>

        <section className="action-grid">
          <article className="card panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Action</p>
                <h3>summarize</h3>
              </div>
              <span className="badge subtle">Mock behavior</span>
            </div>
            <textarea
              value={summaryInput}
              onChange={(event) => setSummaryInput(event.target.value)}
              rows="5"
            />
            <button type="button" className="primary-button" onClick={handleSummarize}>
              Run summarize
            </button>
            <div className="result-box">{summaryOutput}</div>
          </article>

          <article className="card panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Action</p>
                <h3>create_task</h3>
              </div>
              <span className="badge subtle">Adds mock task</span>
            </div>
            <input
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Enter a task title"
            />
            <button type="button" className="primary-button" onClick={handleCreateTask}>
              Run create_task
            </button>
            <p className="helper-copy">Creates a lightweight task card in the Tasks tab.</p>
          </article>

          <article className="card panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Action</p>
                <h3>draft_message</h3>
              </div>
              <span className="badge subtle">Generates copy</span>
            </div>
            <textarea
              value={draftContext}
              onChange={(event) => setDraftContext(event.target.value)}
              rows="5"
            />
            <button type="button" className="primary-button" onClick={handleDraftMessage}>
              Run draft_message
            </button>
            <div className="result-box">{draftMessage}</div>
          </article>

          <article className="card panel twin-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Backend</p>
                <h3>Twin API</h3>
              </div>
              <span className={`badge subtle ${apiHealth.status === 'online' ? 'success' : 'danger'}`}>
                {apiHealth.status}
              </span>
            </div>
            <textarea
              value={twinInput}
              onChange={(event) => setTwinInput(event.target.value)}
              rows="5"
            />
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={triggerWorkflow}
                onChange={(event) => setTriggerWorkflow(event.target.checked)}
              />
              Trigger n8n webhook too
            </label>
            <button type="button" className="primary-button" onClick={handleTwinQuery} disabled={apiLoading}>
              {apiLoading ? 'Calling Twin API…' : 'Run Twin API'}
            </button>
            <div className="result-box">
              {twinResult ? twinResult.reply : apiHealth.data?.message || 'Twin API health check pending.'}
            </div>
          </article>
        </section>

        <section className="tab-panels">
          {activeTab === 'Chat' && (
            <article className="card panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Tab</p>
                  <h3>Chat</h3>
                </div>
                <span className="badge subtle">Assistant + backend demo surface</span>
              </div>
              <div className="chat-feed">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`chat-bubble ${message.role}`}>
                    <div className="chat-meta">
                      <strong>{message.label}</strong>
                    </div>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type into the mock chat"
                />
                <button type="button" className="secondary-button" onClick={handleSendChat}>
                  Send
                </button>
              </div>
            </article>
          )}

          {activeTab === 'Tasks' && (
            <article className="card panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Tab</p>
                  <h3>Tasks</h3>
                </div>
                <span className="badge subtle">Driven by create_task</span>
              </div>
              <div className="stack-list">
                {taskList.map((task) => (
                  <div key={task.id} className="stack-card">
                    <div>
                      <strong>{task.title}</strong>
                      <p>Source: {task.source}</p>
                    </div>
                    <span className="status-chip">{task.status}</span>
                  </div>
                ))}
              </div>
            </article>
          )}

          {activeTab === 'Projects' && (
            <article className="card panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Tab</p>
                  <h3>Projects</h3>
                </div>
                <span className="badge subtle">Shows draft_message context</span>
              </div>
              <div className="stack-list">
                {projects.map((project) => (
                  <div key={project.name} className="stack-card vertical">
                    <strong>{project.name}</strong>
                    <p>{project.summary}</p>
                    <span>{project.focus}</span>
                  </div>
                ))}
              </div>
              <div className="composer-box">
                <p className="eyebrow">Latest draft_message output</p>
                <p>{draftMessage}</p>
              </div>
              {twinResult?.context && (
                <div className="composer-box muted-box">
                  <p className="eyebrow">Latest Twin API context</p>
                  <p>{twinResult.context.inputPreview || 'No preview available.'}</p>
                </div>
              )}
            </article>
          )}

          {activeTab === 'Memory' && (
            <article className="card panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Tab</p>
                  <h3>Memory</h3>
                </div>
                <span className="badge subtle">Read-only mock memory</span>
              </div>
              <ul className="memory-list">
                {memories.map((memory) => (
                  <li key={memory}>{memory}</li>
                ))}
              </ul>
              <div className="composer-box muted-box">
                <p>
                  Future memory integrations can land here later. For now, the Twin API already
                  exposes a small context retrieval step for demos and integration wiring.
                </p>
              </div>
            </article>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
