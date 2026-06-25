import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown,
  Clipboard, Code2, GraduationCap, Lightbulb, Menu, Play, RotateCcw,
  Sparkles, Square, Terminal, Trash2, X
} from "lucide-react";
import { codexFramework, lessons } from "./course";
import type { Exercise, ProgressState, RunResult, ValidationRule } from "./types";
import { usePythonRunner } from "./usePythonRunner";

const STORAGE_KEY = "python-codex-progress-v1";
const defaultProgress: ProgressState = {
  completedLessons: [],
  completedExercises: [],
  codeByExercise: {},
  lastLessonId: lessons[0].id
};

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function validate(rule: ValidationRule, code: string, output: string) {
  const includesAll = (source: string, values: string[]) => values.every((value) => source.includes(value));
  if (rule.type === "outputIncludes") return includesAll(output, rule.values);
  if (rule.type === "codeIncludes") return includesAll(code, rule.values);
  return includesAll(output, rule.output) && includesAll(code, rule.code);
}

function CodeRunner({
  code, onChange, onReset, onRun, running, result, label = "试着运行"
}: {
  code: string;
  onChange: (code: string) => void;
  onReset: () => void;
  onRun: () => void;
  running: boolean;
  result: RunResult | null;
  label?: string;
}) {
  return (
    <div className="code-card">
      <div className="code-toolbar">
        <span><Code2 size={16} /> Python</span>
        <button className="icon-text-button" onClick={onReset} title="恢复初始代码">
          <RotateCcw size={15} /> 重置
        </button>
      </div>
      <textarea
        className="code-editor"
        value={code}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-label="Python 代码编辑器"
      />
      <div className="run-bar">
        <button className={`run-button ${running ? "running" : ""}`} onClick={onRun}>
          {running ? <><Square size={15} fill="currentColor" /> 停止运行</> : <><Play size={16} fill="currentColor" /> {label}</>}
        </button>
        {running && <span className="loading-note">首次运行正在准备 Python，可能需要几秒…</span>}
      </div>
      <div className={`output-panel ${result?.error ? "has-error" : ""}`}>
        <div className="output-title"><Terminal size={15} /> 运行结果</div>
        {!result && <span className="output-placeholder">点击运行，结果会出现在这里。</span>}
        {result && !result.output && !result.error && <span className="output-placeholder">程序运行成功，没有输出内容。</span>}
        {result?.output && <pre>{result.output}</pre>}
        {result?.error && <pre className="error-text">{result.error}</pre>}
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise, code, setCode, completed, toggleComplete
}: {
  exercise: Exercise;
  code: string;
  setCode: (value: string) => void;
  completed: boolean;
  toggleComplete: () => void;
}) {
  const { run, stop, status } = usePythonRunner();
  const [result, setResult] = useState<RunResult | null>(null);
  const [feedback, setFeedback] = useState<"success" | "retry" | null>(completed ? "success" : null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleRun = async () => {
    if (status === "running") {
      stop();
      return;
    }
    setFeedback(null);
    const nextResult = await run(code, exercise.input);
    setResult(nextResult);
    if (nextResult.error) {
      setFeedback("retry");
      return;
    }
    const passed = validate(exercise.validation, code, nextResult.output);
    setFeedback(passed ? "success" : "retry");
    if (passed && !completed) toggleComplete();
  };

  return (
    <article className={`exercise-card ${completed ? "completed" : ""}`}>
      <div className="exercise-heading">
        <div className="exercise-number"><Check size={16} /></div>
        <div>
          <span className="section-kicker">动手练习</span>
          <h3>{exercise.title}</h3>
        </div>
        {completed && <span className="done-pill"><CheckCircle2 size={15} /> 已完成</span>}
      </div>
      <p className="task-copy">{exercise.task}</p>
      <div className="expectation"><span>目标</span>{exercise.expected}</div>
      <CodeRunner
        code={code}
        onChange={setCode}
        onReset={() => { setCode(exercise.starterCode); setResult(null); setFeedback(null); }}
        onRun={handleRun}
        running={status === "running"}
        result={result}
        label="运行并检查"
      />
      {feedback === "success" && (
        <div className="feedback success"><Sparkles size={18} /><div><strong>漂亮，检查通过！</strong><span>你可以继续下一题，也可以改改代码看看会发生什么。</span></div></div>
      )}
      {feedback === "retry" && (
        <div className="feedback retry"><Lightbulb size={18} /><div><strong>还差一点点</strong><span>{result?.error ? "先看看上方的报错，通常最后一行最有用。" : "程序能运行，但结果还没达到目标。试试下面的提示。"}</span></div></div>
      )}
      <div className="help-row">
        <button className="secondary-button" onClick={() => setHintLevel((level) => Math.min(level + 1, exercise.hints.length))}>
          <Lightbulb size={16} /> {hintLevel ? "再给一点提示" : "给我一个提示"}
        </button>
        <button className="text-button" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "收起参考答案" : "查看参考答案"}
        </button>
      </div>
      {hintLevel > 0 && (
        <div className="hint-box">
          {exercise.hints.slice(0, hintLevel).map((hint, index) => <p key={hint}>提示 {index + 1}：{hint}</p>)}
        </div>
      )}
      {showAnswer && (
        <div className="answer-box">
          <div><span>参考答案</span><button onClick={() => setCode(exercise.answer)}>放进编辑器试试</button></div>
          <pre>{exercise.answer}</pre>
        </div>
      )}
    </article>
  );
}

function App() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [activeId, setActiveId] = useState(progress.lastLessonId);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [exampleCode, setExampleCode] = useState("");
  const [exampleResult, setExampleResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState("");
  const [showReset, setShowReset] = useState(false);
  const { run, stop, status } = usePythonRunner();

  const activeLesson = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0];
  const activeIndex = lessons.indexOf(activeLesson);
  const completedCount = progress.completedLessons.length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  const lessonExerciseDone = activeLesson.exercises.filter((item) => progress.completedExercises.includes(item.id)).length;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setExampleCode(activeLesson.exampleCode);
    setExampleResult(null);
    setProgress((current) => ({ ...current, lastLessonId: activeLesson.id }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeLesson.id]);

  const currentCodes = useMemo(() => {
    const result: Record<string, string> = {};
    activeLesson.exercises.forEach((exercise) => {
      result[exercise.id] = progress.codeByExercise[exercise.id] ?? exercise.starterCode;
    });
    return result;
  }, [activeLesson, progress.codeByExercise]);

  const updateCode = (id: string, code: string) => {
    setProgress((current) => ({
      ...current,
      codeByExercise: { ...current.codeByExercise, [id]: code }
    }));
  };

  const toggleExercise = (id: string) => {
    setProgress((current) => ({
      ...current,
      completedExercises: current.completedExercises.includes(id)
        ? current.completedExercises.filter((item) => item !== id)
        : [...current.completedExercises, id]
    }));
  };

  const markLesson = () => {
    setProgress((current) => ({
      ...current,
      completedLessons: current.completedLessons.includes(activeId)
        ? current.completedLessons.filter((id) => id !== activeId)
        : [...current.completedLessons, activeId]
    }));
  };

  const selectLesson = (id: string) => {
    setActiveId(id);
    setMobileMenu(false);
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const codexPrompt = `${codexFramework}\n\n【本课主题】\n${activeLesson.title}\n\n【给 Codex 的具体请求】\n${activeLesson.codexTip}`;

  const runExample = async () => {
    if (status === "running") { stop(); return; }
    setExampleResult(await run(exampleCode, activeLesson.exampleInput));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    setActiveId(lessons[0].id);
    setShowReset(false);
  };

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="打开课程目录"><Menu /></button>
        <div className="mini-brand"><span>Py</span>代码起步营</div>
        <span className="mini-progress">{percent}%</span>
      </header>

      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">Py<span>+</span></div>
          <div><strong>代码起步营</strong><span>Python × Codex</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="关闭课程目录"><X /></button>
        </div>
        <div className="course-progress">
          <div><span>初级 · 8 课</span><strong>{percent}%</strong></div>
          <div className="progress-track"><i style={{ width: `${percent}%` }} /></div>
          <p>{completedCount === 0 ? "从第一行代码开始，慢慢来。" : `已完成 ${completedCount} 课，继续保持好奇。`}</p>
        </div>
        <nav className="lesson-nav" aria-label="课程目录">
          {lessons.map((lesson) => {
            const isDone = progress.completedLessons.includes(lesson.id);
            return (
              <button key={lesson.id} className={lesson.id === activeId ? "active" : ""} onClick={() => selectLesson(lesson.id)}>
                <span className={`lesson-dot ${isDone ? "done" : ""}`}>{isDone ? <Check size={14} /> : lesson.number}</span>
                <span><small>{lesson.eyebrow}</small>{lesson.title}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => setShowReset(true)}><Trash2 size={15} /> 重置学习进度</button>
          <span>所有进度只保存在你的浏览器</span>
        </div>
      </aside>
      {mobileMenu && <button className="sidebar-scrim" onClick={() => setMobileMenu(false)} aria-label="关闭目录" />}

      <main className="main-content">
        <div className="lesson-topbar">
          <span><BookOpen size={16} /> 初级学习路径</span>
          <span>第 {activeLesson.number} / {lessons.length} 课</span>
        </div>

        <section className="lesson-hero">
          <div className="hero-meta"><span>LESSON {String(activeLesson.number).padStart(2, "0")}</span><i /> <span>{activeLesson.duration}</span></div>
          <h1>{activeLesson.title}</h1>
          <p>{activeLesson.goal}</p>
          <div className="hero-chips">
            <span><GraduationCap size={16} /> 零基础友好</span>
            <span><Terminal size={16} /> 边学边运行</span>
          </div>
        </section>

        <div className="content-column">
          <section className="learning-section">
            <div className="section-title"><span>01</span><div><small>先理解</small><h2>这是什么？</h2></div></div>
            <div className="analogy-card"><Sparkles size={20} /><p>{activeLesson.analogy}</p></div>
            {activeLesson.explanation.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}
            <div className="key-points">
              <strong>这一课记住三件事</strong>
              <div>{activeLesson.keyPoints.map((point, index) => <span key={point}><b>{index + 1}</b>{point}</span>)}</div>
            </div>
          </section>

          <section className="learning-section">
            <div className="section-title"><span>02</span><div><small>看它工作</small><h2>运行一个例子</h2></div></div>
            <p className="body-copy">代码已经替你写好。先点运行，再试着改一处，看看结果如何变化。放心，怎么改都不会弄坏电脑。</p>
            <CodeRunner
              code={exampleCode}
              onChange={setExampleCode}
              onReset={() => { setExampleCode(activeLesson.exampleCode); setExampleResult(null); }}
              onRun={runExample}
              running={status === "running"}
              result={exampleResult}
            />
          </section>

          <section className="learning-section">
            <div className="section-title"><span>03</span><div><small>轮到你了</small><h2>亲手写一写</h2></div></div>
            <p className="body-copy">遇到报错不是失败，而是电脑在努力告诉你哪里需要调整。先读最后一行，再用提示。</p>
            <div className="exercise-list">
              {activeLesson.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  code={currentCodes[exercise.id]}
                  setCode={(code) => updateCode(exercise.id, code)}
                  completed={progress.completedExercises.includes(exercise.id)}
                  toggleComplete={() => toggleExercise(exercise.id)}
                />
              ))}
            </div>
          </section>

          <section className="codex-section">
            <div className="codex-icon"><Sparkles /></div>
            <div className="codex-copy">
              <span className="section-kicker">和 Codex 一起学</span>
              <h2>会提问，也是一种编程能力</h2>
              <p>别只说“代码不工作”。告诉 Codex 目标、代码、实际结果和期望结果，它才能真正帮你理解问题。</p>
              <div className="prompt-card">
                <div><span>本课提问模板</span><button onClick={() => copyText(codexPrompt, "lesson")}><Clipboard size={15} /> {copied === "lesson" ? "已复制" : "复制给 Codex"}</button></div>
                <pre>{codexPrompt}</pre>
              </div>
              <div className="codex-rule"><Lightbulb size={17} /><span><strong>推荐做法：</strong>先要解释和提示，亲自尝试后，再请 Codex 检查。这样学得更牢。</span></div>
            </div>
          </section>

          <section className="lesson-finish">
            <div>
              <span>{lessonExerciseDone} / {activeLesson.exercises.length} 个练习完成</span>
              <h2>{progress.completedLessons.includes(activeId) ? "这一课已经完成" : "准备好进入下一步了吗？"}</h2>
              <p>{lessonExerciseDone < activeLesson.exercises.length ? "建议先完成练习，不过你也可以按自己的节奏前进。" : "做得很好。把这一课标记完成，继续下一课吧。"}</p>
            </div>
            <button className={progress.completedLessons.includes(activeId) ? "complete-button completed" : "complete-button"} onClick={markLesson}>
              {progress.completedLessons.includes(activeId) ? <><CheckCircle2 /> 已完成本课</> : <><Check /> 标记本课完成</>}
            </button>
          </section>

          {activeLesson.number === 8 && (
            <section className="graduation-card">
              <GraduationCap size={34} />
              <span>初级路线完成</span>
              <h2>你已经不再是“完全不懂代码”的人了。</h2>
              <p>你能读懂基础 Python、拆分一个小问题、运行并检查代码，也知道怎样把上下文交给 Codex。下一步可以继续学习字典、文件、模块和真实自动化。</p>
              <button onClick={() => copyText(codexFramework, "final")}><Clipboard size={16} /> {copied === "final" ? "已复制" : "收藏通用 Codex 模板"}</button>
            </section>
          )}

          <nav className="bottom-nav">
            <button disabled={activeIndex === 0} onClick={() => selectLesson(lessons[activeIndex - 1].id)}><ArrowLeft /> 上一课</button>
            {activeIndex < lessons.length - 1 && (
              <button className="next-button" onClick={() => selectLesson(lessons[activeIndex + 1].id)}>下一课：{lessons[activeIndex + 1].title} <ArrowRight /></button>
            )}
          </nav>
        </div>
      </main>

      {showReset && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowReset(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-icon"><Trash2 /></div>
            <h2>重置全部学习进度？</h2>
            <p>课程完成状态和你写过的练习代码都会被清除。这个操作无法撤销。</p>
            <div><button className="secondary-button" onClick={() => setShowReset(false)}>先不重置</button><button className="danger-button" onClick={resetProgress}>确认重置</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
