let pyodideRuntime;

async function getPyodide() {
  if (!pyodideRuntime) {
    const baseUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
    importScripts(`${baseUrl}pyodide.js`);
    pyodideRuntime = await loadPyodide({ indexURL: baseUrl });
  }
  return pyodideRuntime;
}

self.onmessage = async (event) => {
  const { id, code, inputs = [] } = event.data;
  let output = "";
  let error = "";

  try {
    const runtime = await getPyodide();
    runtime.setStdout({ batched: (text) => { output += `${text}\n`; } });
    runtime.setStderr({ batched: (text) => { error += `${text}\n`; } });
    runtime.globals.set("__codex_inputs", inputs);
    await runtime.runPythonAsync(`
import builtins
_codex_input_values = iter(__codex_inputs.to_py())
def _codex_input(prompt=""):
    if prompt:
        print(prompt, end="")
    try:
        value = next(_codex_input_values)
        print(value)
        return value
    except StopIteration:
        raise EOFError("练习没有提供更多输入")
builtins.input = _codex_input
`);
    await runtime.runPythonAsync(code);
  } catch (err) {
    error += err instanceof Error ? err.message : String(err);
    error = error.replace(/PythonError: Traceback \(most recent call last\):\n/g, "");
  }

  self.postMessage({ id, output: output.trimEnd(), error: error.trimEnd() });
};
