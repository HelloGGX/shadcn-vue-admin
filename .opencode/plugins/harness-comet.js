import Ponytail from 'file:///C:/Users/gavin/.harness/shared/current/payload/resources/ponytail/.opencode/plugins/ponytail.mjs'
import { spawnSync } from 'node:child_process'
import { appendFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const root = 'G:\\aiProj\\shadcn-vue-admin'
function hook(input) {
  const result = spawnSync('harness', ['hook', '--platform', 'opencode'], { cwd: root, shell: process.platform === 'win32', input: JSON.stringify({ ...input, cwd: root }), encoding: 'utf8', timeout: 30000, windowsHide: true })
  if (result.error || result.signal || result.status !== 0)
    throw new Error(result.stderr || result.error?.message || 'Comet guard failed closed')
}
function guard(name, args) {
  const names = { write: 'Write', edit: 'Edit', apply_patch: 'apply_patch', patch: 'apply_patch' }
  if (!Object.hasOwn(names, name))
    return
  if (!args || typeof args !== 'object' || Array.isArray(args))
    throw new Error('Comet guard received invalid tool input')
  if (names[name] === 'apply_patch') {
    if (typeof args.patchText !== 'string' || !args.patchText.trim())
      throw new Error('Comet guard requires the complete patch')
    const patch = args.patchText
    if (!patch.trimStart().startsWith('*** Begin Patch') || !patch.trimEnd().endsWith('*** End Patch'))
      throw new Error('Comet guard requires the complete patch')
    if (Object.hasOwn(args, 'patch') && args.patch !== patch)
      throw new Error('Comet guard received conflicting patch input')
    // The pinned router reads patchText, but does not yet extract Move to destinations.
    // Pass all affected paths explicitly without implementing phase or scope policy here.
    const targets = [...new Set([...patch.matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to):[ \t]+(.+?)[ \t]*\r?$/gm)].map(match => match[1]))]
    if (!targets.length)
      throw new Error('Comet guard requires patch write targets')
    hook({ tool_name: names[name], tool_input: { ...args, patch, file_paths: targets } })
    return
  }
  const fields = ['filePath', 'path'].filter(field => Object.hasOwn(args, field))
  if (!fields.length || fields.some(field => typeof args[field] !== 'string' || !args[field].trim()))
    throw new Error('Comet guard requires the host write target')
  const target = args[fields[0]]
  if (fields.some(field => args[field] !== target) || Object.hasOwn(args, 'file_path') && args.file_path !== target)
    throw new Error('Comet guard received conflicting host write targets')
  hook({ tool_name: names[name], tool_input: { ...args, file_path: target } })
}
const ponytailMarker = '<!-- harness:ponytail:native -->'
const ponytailEndMarker = '<!-- harness:ponytail:end -->'
const ponytailPluginSha256 = '07b2d5669989369221110dee341bebc8674d3cb19a9dd4102f95891241f70db4'
const ponytailLogDirectory = 'G:\\aiProj\\shadcn-vue-admin\\.harness\\local'
const ponytailLog = 'G:\\aiProj\\shadcn-vue-admin\\.harness\\local\\ponytail-integration.jsonl'
function observePonytail(api, system) {
  const text = system.map(part => typeof part === 'string' ? part : part.text || '').filter(text => text.includes(ponytailMarker)).map(text => text.slice(text.indexOf(ponytailMarker))).join('\n')
  const mode = text.match(/PONYTAIL MODE ACTIVE[^\n]*level:\s*(lite|full|ultra|review)\b/)?.[1]
  try {
    mkdirSync(ponytailLogDirectory, { recursive: true })
    appendFileSync(ponytailLog, `${JSON.stringify({ timestamp: new Date().toISOString(), platform: 'opencode', api, source: process.env.HARNESS_INTEGRATION_PROBE === '1' ? 'verification-probe' : 'native-context-hook', pluginSha256: ponytailPluginSha256, mode: mode || 'off', injected: Boolean(mode) })}\n`, 'utf8')
  }
  catch (error) { console.error('Harness Ponytail observation failed:', error.message) }
}
function clearPonytail(system) {
  for (let i = system.length - 1; i >= 0; i--) {
    const part = system[i]
    const text = typeof part === 'string' ? part : part.type === 'text' ? part.text : ''
    const start = text.indexOf(ponytailMarker)
    const end = start < 0 ? -1 : text.indexOf(ponytailEndMarker, start + ponytailMarker.length)
    if (end < 0)
      continue
    const preserved = text.slice(0, start) + text.slice(end + ponytailEndMarker.length)
    if (!preserved)
      system.splice(i, 1)
    else if (typeof part === 'string')
      system[i] = preserved
    else part.text = preserved
  }
}
async function ponytailServer(...args) {
  const upstream = await Ponytail.server(...args)
  return {
    ...upstream,
    'config': async (config) => {
      // Project skills already expose these IDs. Register commands without a second skill search root.
      const originalSkills = config.skills
      const delegated = { ...config, skills: { ...originalSkills, paths: [...(originalSkills?.paths || [])] } }
      await upstream.config(delegated)
      config.command = delegated.command
    },
    'experimental.chat.system.transform': async (input, output) => {
      clearPonytail(output.system)
      const before = [...output.system]
      await upstream['experimental.chat.system.transform'](input, output)
      for (let i = 0; i < output.system.length; i++) {
        const prefix = before[i] || ''
        if (output.system[i] !== prefix && output.system[i].slice(prefix.length).includes('PONYTAIL MODE ACTIVE')) {
          output.system[i] = prefix + ponytailMarker + output.system[i].slice(prefix.length) + ponytailEndMarker
        }
      }
      observePonytail('v1.server', output.system)
    },
  }
}
async function setupPonytail(ctx) {
  return Ponytail.setup({
    ...ctx,
    skill: {
      ...ctx.skill,
      transform: callback => ctx.skill.transform(editor => callback({
        ...editor,
        add: (skill) => {
          if (!editor.get(skill.id))
            editor.add(skill)
        },
      })),
    },
    session: {
      ...ctx.session,
      hook: (name, callback) => ctx.session.hook(name, (event) => {
        clearPonytail(event.system)
        const before = event.system.length
        callback(event)
        for (const part of event.system.slice(before)) {
          if (part.type === 'text' && part.text.includes('PONYTAIL MODE ACTIVE'))
            part.text = `${ponytailMarker}\n${part.text}${ponytailEndMarker}`
        }
        observePonytail('v2.setup', event.system)
      }),
    },
  })
}
async function HarnessComet(...args) {
  return {
    ...(await ponytailServer(...args)),
    'event': async ({ event }) => {
      if (event.type === 'session.created')
        hook({ hook_event_name: 'SessionStart' })
    },
    'tool.execute.before': async (input, output) => { guard(input.tool, output.args) },
  }
}
export default {
  id: 'harness-project-tools',
  server: HarnessComet,
  async setup(ctx) {
    await setupPonytail(ctx)
    await ctx.tool.hook('execute.before', (event) => { guard(event.tool, event.input) })
    const controller = new AbortController()
    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
          if (event.type === 'session.created' && path.relative(root, event.data.location.directory) === '' && event.data.location.workspaceID === ctx.location.workspaceID)
            hook({ hook_event_name: 'SessionStart' })
        }
      }
      catch (error) {
        if (!controller.signal.aborted)
          console.error('Harness SessionStart failed:', error)
      }
    })()
    return () => controller.abort()
  },
}
