import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8787
const openclawBaseUrl = process.env.OPENCLOW_BASE_URL || process.env.OPENCLAW_BASE_URL || 'http://127.0.0.1:3001'
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || ''

app.use(cors())
app.use(express.json())

const memoryContext = [
  'Sandero Hub is a simplified four-tab MVP.',
  'Current exposed actions are summarize, create_task, and draft_message.',
  'Twin API is the thin backend layer for context, OpenClaw calls, and n8n triggers.',
]

function buildContext(input = '') {
  return {
    product: 'Sandero Hub',
    scope: 'MVP',
    tabs: ['Chat', 'Tasks', 'Projects', 'Memory'],
    knownMemories: memoryContext,
    inputPreview: input.trim().slice(0, 240),
    retrievedAt: new Date().toISOString(),
  }
}

function fallbackTwinReply(input, context) {
  if (!input.trim()) {
    return 'Twin API is online. Send some input and it will return context, optional OpenClaw output, and optional n8n webhook status.'
  }

  return `Twin fallback reply: based on the current ${context.scope} context for ${context.product}, the request was received and can now be routed to OpenClaw or n8n.`
}

async function callOpenClaw(input, context) {
  if (!process.env.OPENCLAW_API_URL) {
    return {
      ok: false,
      skipped: true,
      reason: 'Set OPENCLAW_API_URL to enable live OpenClaw calls.',
    }
  }

  try {
    const response = await fetch(process.env.OPENCLAW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.OPENCLAW_API_KEY ? { Authorization: `Bearer ${process.env.OPENCLAW_API_KEY}` } : {}),
      },
      body: JSON.stringify({ input, context }),
    })

    const text = await response.text()

    return {
      ok: response.ok,
      skipped: false,
      status: response.status,
      data: text,
    }
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      reason: error.message,
    }
  }
}

async function triggerN8n(payload) {
  if (!n8nWebhookUrl) {
    return {
      ok: false,
      skipped: true,
      reason: 'Set N8N_WEBHOOK_URL to enable webhook triggers.',
    }
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await response.text()

    return {
      ok: response.ok,
      skipped: false,
      status: response.status,
      data: text,
    }
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      reason: error.message,
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'twin-api',
    openclawBaseUrl,
    n8nConfigured: Boolean(n8nWebhookUrl),
    timestamp: new Date().toISOString(),
  })
})

app.post('/api/context', (req, res) => {
  const input = req.body?.input || ''
  res.json({ ok: true, context: buildContext(input) })
})

app.post('/api/twin/query', async (req, res) => {
  const input = req.body?.input || ''
  const triggerWorkflow = Boolean(req.body?.triggerWorkflow)
  const context = buildContext(input)
  const openclaw = await callOpenClaw(input, context)
  const n8n = triggerWorkflow ? await triggerN8n({ input, context, source: 'sandero-hub' }) : { skipped: true }

  res.json({
    ok: true,
    input,
    context,
    openclaw,
    n8n,
    reply: openclaw.ok && openclaw.data ? openclaw.data : fallbackTwinReply(input, context),
  })
})

app.post('/api/n8n/trigger', async (req, res) => {
  const payload = {
    ...req.body,
    source: 'sandero-hub',
    triggeredAt: new Date().toISOString(),
  }

  const result = await triggerN8n(payload)
  res.json({ ok: true, result })
})

app.listen(port, () => {
  console.log(`Twin API listening on http://127.0.0.1:${port}`)
})
