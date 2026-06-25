import { useCallback, useEffect, useRef, useState } from "react";
import type { RunResult } from "./types";

export function usePythonRunner() {
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);
  const resolverRef = useRef<((result: RunResult) => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"idle" | "running">("idle");
  const workerUrl = `${import.meta.env.BASE_URL}python-worker.js`;

  const createWorker = useCallback(() => {
    const worker = new Worker(workerUrl);
    worker.onmessage = (event) => {
      if (event.data.id !== requestId.current) return;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setStatus("idle");
      resolverRef.current?.({ output: event.data.output, error: event.data.error });
      resolverRef.current = null;
    };
    workerRef.current = worker;
  }, [workerUrl]);

  useEffect(() => {
    createWorker();
    return () => workerRef.current?.terminate();
  }, [createWorker]);

  const stop = useCallback(() => {
    workerRef.current?.terminate();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    resolverRef.current?.({ output: "", error: "程序运行时间过长，已为你停止。请检查是否存在无法结束的循环。" });
    resolverRef.current = null;
    setStatus("idle");
    createWorker();
  }, [createWorker]);

  const run = useCallback((code: string, inputs: string[] = []): Promise<RunResult> => {
    if (status === "running") stop();
    setStatus("running");
    requestId.current += 1;
    const id = requestId.current;
    workerRef.current ??= new Worker(workerUrl);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      workerRef.current!.postMessage({ id, code, inputs });
      timerRef.current = window.setTimeout(stop, 12000);
    });
  }, [status, stop, workerUrl]);

  return { run, stop, status };
}
