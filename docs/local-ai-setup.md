# Local AI Setup for Nexo (MacBook Air 8 GB)

This guide configures VS Code to use local models through Ollama, with two extension options:

- Continue
- Cline

The local runtime and first model are already installed on this machine.

## 1) Verify Ollama is running

Run:

```bash
brew services list | grep ollama
ollama list
ollama run qwen2.5-coder:3b "Return exactly: LOCAL_OK"
```

Expected:

- service status is `started`
- model `qwen2.5-coder:3b` appears in the list
- command returns `LOCAL_OK`

If needed:

```bash
brew services restart ollama
```

## 2) Continue setup (recommended first)

Install the Continue extension in VS Code.

Create this file in your home folder:

- `~/.continue/config.json`

Suggested config:

```yaml
name: Main Config
version: 1.0.0
schema: v1
models:
  - name: GPT OSS 20B (Groq)
    provider: groq
    model: openai/gpt-oss-20b
    apiKey: YOUR_GROQ_API_KEY
    capabilities:
      - tool_use
    roles:
      - chat
      - edit
      - apply
    defaultCompletionOptions:
      temperature: 0.1

  - name: Local Qwen 3B (Autocomplete)
    provider: ollama
    model: qwen2.5-coder:3b
    apiBase: http://127.0.0.1:11434
    roles:
      - autocomplete
    autocompleteOptions:
      onlyMyCode: true
      debounceDelay: 250
      maxPromptTokens: 1024

context:
  - provider: diff
  - provider: file
  - provider: code
```

## 3) Usage strategy for this project

For this machine:

- Default model: `openai/gpt-oss-20b`
- Autocompletion: `qwen2.5-coder:3b`

Prompting rules to reduce retries:

1. Give only 1-3 files of context.
2. Ask for concrete edits and acceptance criteria.
3. Run lint/tests locally before next prompt.
4. If no progress after 2 attempts, split task smaller.

## 4) Quick health checks

```bash
curl -s http://127.0.0.1:11434/api/tags | jq '.models[].name'
```

```bash
ollama ps
```

If `ollama ps` is empty, it only means no model is actively running yet.
