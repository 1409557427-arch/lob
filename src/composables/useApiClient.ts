import { useSettingsStore } from '../stores/settings'

let abortController: AbortController | null = null

export function useApiClient() {
  const settings = useSettingsStore()

  function abort() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  async function sendMessage(
    messages: { role: string; content: string }[],
    onChunk: (text: string) => void,
    onDone: (fullText: string) => void,
    onError: (err: string) => void
  ) {
    abort()
    abortController = new AbortController()

    const { baseUrl, apiKey, model } = settings.api
    if (!apiKey) {
      onError('请在设置页面配置 API 密钥')
      return
    }

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages,
          stream: true,
          temperature: 0.8,
          max_tokens: 2048,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const err = await response.text()
        onError(`API 错误 (${response.status}): ${err}`)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        onError('无法读取响应流')
        return
      }

      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              fullText += delta
              onChunk(fullText)
            }
          } catch {
            // Skip parse errors on partial chunks
          }
        }
      }

      onDone(fullText)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        onError('请求已取消')
      } else {
        onError(`请求失败: ${err.message}`)
      }
    }
  }

  return { sendMessage, abort }
}
