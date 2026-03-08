import './App.css'

const navigation = [
  { label: 'Overview', icon: '◫' },
  { label: 'Chat', icon: '✦' },
  { label: 'Tasks', icon: '✓' },
  { label: 'Memory', icon: '◎' },
  { label: 'Activity', icon: '↻' },
  { label: 'Settings', icon: '⚙' },
]

const projectStats = [
  { label: 'Open tasks', value: '12', detail: '4 due today' },
  { label: 'Team focus', value: '87%', detail: 'Strong weekly momentum' },
  { label: 'Response time', value: '6m', detail: 'Demo assistant benchmark' },
]

const taskColumns = [
  {
    title: 'Today',
    items: [
      { title: 'Review roadmap copy', tag: 'Content', priority: 'High' },
      { title: 'Prepare partner sync notes', tag: 'Ops', priority: 'Medium' },
    ],
  },
  {
    title: 'Next up',
    items: [
      { title: 'Map CRM integration points', tag: 'Integrations', priority: 'Medium' },
      { title: 'Test onboarding prompts', tag: 'Product', priority: 'Low' },
    ],
  },
]

const chatMessages = [
  {
    author: 'Sandero Hub',
    tone: 'assistant',
    text: 'Welcome back. The workspace is running on mock data for now, so this is safe to demo and easy to extend later.',
    time: '21:07',
  },
  {
    author: 'Sander',
    tone: 'user',
    text: 'What should I show first in a quick product walkthrough?',
    time: '21:08',
  },
  {
    author: 'Sandero Hub',
    tone: 'assistant',
    text: 'Start with the overview, jump into the task board, then show how memory, settings, and activity work together as one cockpit.',
    time: '21:09',
  },
]

const activity = [
  { time: '21:11', title: 'Task updated', detail: 'Roadmap review moved to Today.' },
  { time: '20:54', title: 'Memory saved', detail: 'Captured user preference for Slack workspace context.' },
  { time: '20:32', title: 'Overview refreshed', detail: 'Demo metrics recalculated for the dashboard.' },
  { time: '19:48', title: 'Chat summary generated', detail: 'Prepared a concise handoff note for the team.' },
]

const memories = [
  'Prefers the assistant name “Sandero”.',
  'Primary working language is English.',
  'Wants a clean MVP first, integrations later.',
]

const settings = [
  { label: 'Theme', value: 'Midnight Graphite' },
  { label: 'Workspace mode', value: 'Demo / Mock Data' },
  { label: 'Notifications', value: 'Digest only' },
  { label: 'Future integrations', value: 'Slack, Linear, Calendar' },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-card">
            <div className="brand-mark">S</div>
            <div>
              <p className="eyebrow">Command center</p>
              <h1>Sandero Hub</h1>
            </div>
          </div>

          <nav className="nav-list" aria-label="Main navigation">
            {navigation.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={`nav-item ${index === 0 ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="pulse-card">
            <span className="status-dot" />
            Demo data enabled
          </div>
          <p>Built as a flexible MVP for Replit-ready iteration.</p>
        </div>
      </aside>

      <main className="dashboard">
        <header className="hero-panel card">
          <div>
            <p className="eyebrow">Project overview</p>
            <h2>Your AI workspace, minus the clutter.</h2>
            <p className="hero-copy">
              A dark, polished dashboard for conversations, project tracking, memory,
              settings, and activity. Everything below uses mock data so future
              integrations can plug in cleanly.
            </p>
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-button">New briefing</button>
            <button type="button" className="secondary-button">Share demo view</button>
          </div>
        </header>

        <section className="stats-grid">
          {projectStats.map((stat) => (
            <article className="card stat-card" key={stat.label}>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.detail}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="card panel project-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Tasks</p>
                <h3>Focused task list</h3>
              </div>
              <span className="badge">MVP</span>
            </div>

            <div className="task-columns">
              {taskColumns.map((column) => (
                <div key={column.title} className="task-column">
                  <h4>{column.title}</h4>
                  {column.items.map((task) => (
                    <div className="task-card" key={task.title}>
                      <div className="task-topline">
                        <span className="task-tag">{task.tag}</span>
                        <span className="task-priority">{task.priority}</span>
                      </div>
                      <strong>{task.title}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <article className="card panel chat-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Chat window</p>
                <h3>Assistant conversation</h3>
              </div>
              <span className="badge subtle">Live mock</span>
            </div>

            <div className="chat-feed">
              {chatMessages.map((message) => (
                <div key={`${message.author}-${message.time}`} className={`chat-bubble ${message.tone}`}>
                  <div className="chat-meta">
                    <strong>{message.author}</strong>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input type="text" value="Ask about tasks, memory, or settings…" readOnly />
              <button type="button" className="primary-button small">Send</button>
            </div>
          </article>

          <article className="card panel memory-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Memory & profile</p>
                <h3>Sander profile snapshot</h3>
              </div>
            </div>

            <div className="profile-row">
              <div className="avatar">SA</div>
              <div>
                <strong>Sander</strong>
                <p>Prefers a direct, clean AI copilot experience.</p>
              </div>
            </div>

            <ul className="memory-list">
              {memories.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card panel settings-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Settings</p>
                <h3>Workspace controls</h3>
              </div>
            </div>

            <div className="settings-list">
              {settings.map((setting) => (
                <div className="setting-row" key={setting.label}>
                  <span>{setting.label}</span>
                  <strong>{setting.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card panel activity-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Activity log</p>
                <h3>Recent timeline</h3>
              </div>
            </div>

            <div className="activity-list">
              {activity.map((entry) => (
                <div className="activity-row" key={`${entry.time}-${entry.title}`}>
                  <span>{entry.time}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
