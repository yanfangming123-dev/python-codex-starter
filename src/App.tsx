import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Dumbbell,
  Clipboard, Code2, GraduationCap, Lightbulb, Menu, Play, RotateCcw,
  Sparkles, Square, Terminal, Trash2, Trophy, X
} from "lucide-react";
import { codexFramework, lessons } from "./course";
import { examExerciseCount, examExercises } from "./exam";
import { workbookExerciseCount, workbookUnits } from "./workbook";
import type { Exercise, ProgressState, RunResult, StudyMode, ValidationRule, WorkbookUnit } from "./types";
import { usePythonRunner } from "./usePythonRunner";

const STORAGE_KEY = "python-codex-progress-v1";
const MODE_KEY = "python-codex-view-v1";
const defaultProgress: ProgressState = {
  completedLessons: [],
  completedExercises: [],
  codeByExercise: {},
  lastLessonId: lessons[0].id,
  workbookCompleted: [],
  workbookCode: {},
  lastWorkbookUnit: workbookUnits[0].id,
  examCompleted: [],
  examCode: {},
  lastExamExercise: examExercises[0].id,
  lastMode: "textbook"
};

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function loadMode(): StudyMode {
  const mode = localStorage.getItem(MODE_KEY);
  return mode === "workbook" || mode === "exam" ? mode : "textbook";
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

function WorkbookView({
  unit,
  completed,
  codeByExercise,
  onCodeChange,
  onComplete,
  onSelectUnit
}: {
  unit: WorkbookUnit;
  completed: string[];
  codeByExercise: Record<string, string>;
  onCodeChange: (id: string, code: string) => void;
  onComplete: (id: string) => void;
  onSelectUnit: (id: string) => void;
}) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const exercise = unit.exercises[exerciseIndex];
  const unitDone = unit.exercises.filter((item) => completed.includes(item.id)).length;
  const unitPercent = Math.round((unitDone / unit.exercises.length) * 100);

  useEffect(() => {
    setExerciseIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [unit.id]);

  return (
    <>
      <div className="lesson-topbar">
        <span><Dumbbell size={16} /> 初级配套练习册</span>
        <span>单元 {unit.number} / {workbookUnits.length}</span>
      </div>
      <section className="lesson-hero workbook-hero">
        <div className="hero-meta"><span>WORKBOOK {String(unit.number).padStart(2, "0")}</span><i /><span>{unit.exercises.length} 道练习</span></div>
        <h1>{unit.title}</h1>
        <p>{unit.subtitle}。先独立尝试，再看提示；参考答案只用来复盘，不用来赶进度。</p>
        <div className="hero-chips">
          {unit.focus.map((focus) => <span key={focus}><Check size={15} /> {focus}</span>)}
        </div>
      </section>
      <div className="content-column workbook-column">
        <section className="workbook-dashboard">
          <div>
            <span className="section-kicker">本单元进度</span>
            <h2>{unitDone} / {unit.exercises.length} 完成</h2>
          </div>
          <div className="workbook-progress"><i style={{ width: `${unitPercent}%` }} /></div>
          <p>建议正确完成后，隔一天在 Thonny 中从空白重写一道“独立”或“综合”题。</p>
        </section>

        <nav className="exercise-picker" aria-label="练习题目录">
          {unit.exercises.map((item, index) => (
            <button
              key={item.id}
              className={`${index === exerciseIndex ? "active" : ""} ${completed.includes(item.id) ? "done" : ""}`}
              onClick={() => setExerciseIndex(index)}
              aria-label={`第 ${index + 1} 题：${item.title}`}
            >
              {completed.includes(item.id) ? <Check size={14} /> : index + 1}
            </button>
          ))}
        </nav>

        <div className="workbook-question-meta">
          <span>第 {exerciseIndex + 1} / {unit.exercises.length} 题</span>
          <b className={`kind-badge kind-${exercise.kind}`}>{exercise.kind}</b>
        </div>

        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          code={codeByExercise[exercise.id] ?? exercise.starterCode}
          setCode={(value) => onCodeChange(exercise.id, value)}
          completed={completed.includes(exercise.id)}
          toggleComplete={() => onComplete(exercise.id)}
        />

        <nav className="bottom-nav workbook-bottom-nav">
          <button disabled={exerciseIndex === 0} onClick={() => setExerciseIndex((index) => index - 1)}><ArrowLeft /> 上一题</button>
          {exerciseIndex < unit.exercises.length - 1 ? (
            <button className="next-button" onClick={() => setExerciseIndex((index) => index + 1)}>下一题 <ArrowRight /></button>
          ) : unit.number < workbookUnits.length ? (
            <button className="next-button" onClick={() => onSelectUnit(workbookUnits[unit.number].id)}>下一单元 <ArrowRight /></button>
          ) : null}
        </nav>

        {unitDone === unit.exercises.length && (
          <section className="unit-complete">
            <CheckCircle2 size={28} />
            <div><span>单元完成</span><h2>基础又扎实了一层。</h2><p>不要急着刷下一单元。挑一道综合题，到 Thonny 中不看答案重写一次。</p></div>
          </section>
        )}
      </div>
    </>
  );
}

function FinalTrainingView({
  exercise,
  completed,
  codeByExercise,
  copied,
  onCodeChange,
  onComplete,
  onSelectExercise,
  onCopy
}: {
  exercise: Exercise;
  completed: string[];
  codeByExercise: Record<string, string>;
  copied: string;
  onCodeChange: (id: string, code: string) => void;
  onComplete: (id: string) => void;
  onSelectExercise: (id: string) => void;
  onCopy: (text: string, id: string) => void;
}) {
  const exerciseIndex = examExercises.findIndex((item) => item.id === exercise.id);
  const safeIndex = exerciseIndex >= 0 ? exerciseIndex : 0;
  const done = completed.length;
  const percent = Math.round((done / examExerciseCount) * 100);
  const currentNumber = safeIndex + 1;
  const prompt = `${codexFramework}

【当前任务】
${exercise.title}

【题目要求】
${exercise.task}

【我的代码】
${codeByExercise[exercise.id] ?? exercise.starterCode}

【给 Codex 的具体请求】
请先不要直接给完整答案。请帮我判断我的思路卡在哪里，给我 1-2 个提示；如果我明确说“给我答案”，你再给完整参考代码。`;

  return (
    <>
      <div className="lesson-topbar">
        <span><Trophy size={16} /> 初级期末综合训练</span>
        <span>题库 {examExerciseCount} 题 · 当前第 {currentNumber} 题</span>
      </div>
      <section className="lesson-hero exam-hero">
        <div className="hero-meta"><span>FINAL TRAINING</span><i /><span>不标章节，只做任务</span></div>
        <h1>期末综合训练</h1>
        <p>这里的题不会告诉你它属于哪一课。你只需要像真正写小程序一样，读懂任务、拆成步骤、写代码、运行、修正。做完这一栏，就可以更有底气进入进阶版。</p>
        <div className="hero-chips">
          <span><Check size={15} /> 60 个独立任务</span>
          <span><Sparkles size={15} /> 只考已学范围</span>
          <span><Terminal size={15} /> 可运行检查</span>
        </div>
      </section>

      <div className="content-column workbook-column">
        <section className="workbook-dashboard exam-dashboard">
          <div>
            <span className="section-kicker">期末进度</span>
            <h2>{done} / {examExerciseCount} 完成</h2>
          </div>
          <div className="workbook-progress exam-progress"><i style={{ width: `${percent}%` }} /></div>
          <p>建议当作“抽题考试”：不会就先看一层提示，仍然不会再问 Codex 解释思路，最后才看参考答案。</p>
        </section>

        <nav className="exercise-picker exam-picker" aria-label="期末训练题库">
          {examExercises.map((item, index) => (
            <button
              key={item.id}
              className={`${index === safeIndex ? "active" : ""} ${completed.includes(item.id) ? "done" : ""}`}
              onClick={() => onSelectExercise(item.id)}
              aria-label={`期末训练第 ${index + 1} 题`}
            >
              {completed.includes(item.id) ? <Check size={14} /> : index + 1}
            </button>
          ))}
        </nav>

        <div className="workbook-question-meta">
          <span>综合任务 {currentNumber} / {examExerciseCount}</span>
          <b className="kind-badge kind-综合">独立综合</b>
        </div>

        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          code={codeByExercise[exercise.id] ?? exercise.starterCode}
          setCode={(value) => onCodeChange(exercise.id, value)}
          completed={completed.includes(exercise.id)}
          toggleComplete={() => onComplete(exercise.id)}
        />

        <section className="codex-section exam-codex">
          <div className="codex-icon"><Sparkles /></div>
          <div className="codex-copy">
            <span className="section-kicker">考试式求助</span>
            <h2>先让 Codex 当教练，不当代写员</h2>
            <p>这套题的目的不是刷答案，而是练习自己定位问题。复制下面模板时，它会带上当前题目和你的代码。</p>
            <div className="prompt-card">
              <div><span>当前题目求助模板</span><button onClick={() => onCopy(prompt, "exam")}><Clipboard size={15} /> {copied === "exam" ? "已复制" : "复制给 Codex"}</button></div>
              <pre>{prompt}</pre>
            </div>
          </div>
        </section>

        <nav className="bottom-nav workbook-bottom-nav">
          <button disabled={safeIndex === 0} onClick={() => onSelectExercise(examExercises[safeIndex - 1].id)}><ArrowLeft /> 上一题</button>
          {safeIndex < examExercises.length - 1 && (
            <button className="next-button" onClick={() => onSelectExercise(examExercises[safeIndex + 1].id)}>下一题 <ArrowRight /></button>
          )}
        </nav>

        {done === examExerciseCount && (
          <section className="unit-complete exam-complete">
            <Trophy size={30} />
            <div><span>期末完成</span><h2>可以准备进入进阶版了。</h2><p>如果你能不看答案完成大部分题，说明基础语法、调试节奏和向 Codex 提问的方式都已经站稳了。</p></div>
          </section>
        )}
      </div>
    </>
  );
}

function App() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [mode, setMode] = useState<StudyMode>(loadMode);
  const [activeId, setActiveId] = useState(progress.lastLessonId);
  const [workbookUnitId, setWorkbookUnitId] = useState(progress.lastWorkbookUnit);
  const [examExerciseId, setExamExerciseId] = useState(progress.lastExamExercise);
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
  const workbookUnit = workbookUnits.find((unit) => unit.id === workbookUnitId) ?? workbookUnits[0];
  const workbookDone = progress.workbookCompleted.length;
  const workbookPercent = Math.round((workbookDone / workbookExerciseCount) * 100);
  const examExercise = examExercises.find((exercise) => exercise.id === examExerciseId) ?? examExercises[0];
  const examDone = progress.examCompleted.length;
  const examPercent = Math.round((examDone / examExerciseCount) * 100);
  const lessonExerciseDone = activeLesson.exercises.filter((item) => progress.completedExercises.includes(item.id)).length;
  const currentPercent = mode === "textbook" ? percent : mode === "workbook" ? workbookPercent : examPercent;

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

  const selectWorkbookUnit = (id: string) => {
    setWorkbookUnitId(id);
    setProgress((current) => ({ ...current, lastWorkbookUnit: id }));
    setMobileMenu(false);
  };

  const selectExamExercise = (id: string) => {
    setExamExerciseId(id);
    setProgress((current) => ({ ...current, lastExamExercise: id }));
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchMode = (nextMode: StudyMode) => {
    setMode(nextMode);
    localStorage.setItem(MODE_KEY, nextMode);
    setProgress((current) => ({ ...current, lastMode: nextMode }));
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateWorkbookCode = (id: string, value: string) => {
    setProgress((current) => ({ ...current, workbookCode: { ...current.workbookCode, [id]: value } }));
  };

  const toggleWorkbookComplete = (id: string) => {
    setProgress((current) => ({
      ...current,
      workbookCompleted: current.workbookCompleted.includes(id)
        ? current.workbookCompleted.filter((item) => item !== id)
        : [...current.workbookCompleted, id]
    }));
  };

  const updateExamCode = (id: string, value: string) => {
    setProgress((current) => ({ ...current, examCode: { ...current.examCode, [id]: value } }));
  };

  const toggleExamComplete = (id: string) => {
    setProgress((current) => ({
      ...current,
      examCompleted: current.examCompleted.includes(id)
        ? current.examCompleted.filter((item) => item !== id)
        : [...current.examCompleted, id]
    }));
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
    localStorage.setItem(MODE_KEY, "textbook");
    setMode("textbook");
    setActiveId(lessons[0].id);
    setWorkbookUnitId(workbookUnits[0].id);
    setExamExerciseId(examExercises[0].id);
    setShowReset(false);
  };

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="打开课程目录"><Menu /></button>
        <div className="mini-brand"><span>Py</span>代码起步营</div>
        <span className="mini-progress">{currentPercent}%</span>
      </header>

      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">Py<span>+</span></div>
          <div><strong>代码起步营</strong><span>Python × Codex</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="关闭课程目录"><X /></button>
        </div>
        <div className="book-switcher" role="tablist" aria-label="学习板块">
          <button role="tab" aria-selected={mode === "textbook"} className={mode === "textbook" ? "active" : ""} onClick={() => switchMode("textbook")}><BookOpen size={15} /> 教材</button>
          <button role="tab" aria-selected={mode === "workbook"} className={mode === "workbook" ? "active" : ""} onClick={() => switchMode("workbook")}><Dumbbell size={15} /> 练习册</button>
          <button role="tab" aria-selected={mode === "exam"} className={mode === "exam" ? "active" : ""} onClick={() => switchMode("exam")}><Trophy size={15} /> 期末训练</button>
        </div>
        <div className="course-progress">
          <div><span>{mode === "textbook" ? "初级教材 · 8 课" : mode === "workbook" ? `配套练习 · ${workbookExerciseCount} 题` : `期末训练 · ${examExerciseCount} 题`}</span><strong>{currentPercent}%</strong></div>
          <div className="progress-track"><i style={{ width: `${currentPercent}%` }} /></div>
          <p>{mode === "textbook"
            ? (completedCount === 0 ? "从第一行代码开始，慢慢来。" : `已完成 ${completedCount} 课，继续保持好奇。`)
            : mode === "workbook"
              ? (workbookDone === 0 ? "不赶进度，把每一个小动作练稳。" : `已完成 ${workbookDone} 题，坚持独立思考。`)
              : (examDone === 0 ? "像期末抽题一样练，不看章节提示。" : `已完成 ${examDone} 道综合题，越来越稳。`)}</p>
        </div>
        <nav className="lesson-nav" aria-label="课程目录">
          {mode === "textbook" ? lessons.map((lesson) => {
            const isDone = progress.completedLessons.includes(lesson.id);
            return (
              <button key={lesson.id} className={lesson.id === activeId ? "active" : ""} onClick={() => selectLesson(lesson.id)}>
                <span className={`lesson-dot ${isDone ? "done" : ""}`}>{isDone ? <Check size={14} /> : lesson.number}</span>
                <span><small>{lesson.eyebrow}</small>{lesson.title}</span>
              </button>
            );
          }) : mode === "workbook" ? workbookUnits.map((unit) => {
            const done = unit.exercises.filter((item) => progress.workbookCompleted.includes(item.id)).length;
            const isDone = done === unit.exercises.length;
            return (
              <button key={unit.id} className={unit.id === workbookUnitId ? "active" : ""} onClick={() => selectWorkbookUnit(unit.id)}>
                <span className={`lesson-dot ${isDone ? "done" : ""}`}>{isDone ? <Check size={14} /> : unit.number}</span>
                <span><small>{done} / {unit.exercises.length} 已完成</small>{unit.title}</span>
              </button>
            );
          }) : examExercises.map((item, index) => {
            const isDone = progress.examCompleted.includes(item.id);
            return (
              <button key={item.id} className={item.id === examExerciseId ? "active" : ""} onClick={() => selectExamExercise(item.id)}>
                <span className={`lesson-dot ${isDone ? "done" : ""}`}>{isDone ? <Check size={14} /> : index + 1}</span>
                <span><small>{isDone ? "已完成" : "待挑战"}</small>综合任务 {index + 1}</span>
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
        {mode === "workbook" ? (
          <WorkbookView
            unit={workbookUnit}
            completed={progress.workbookCompleted}
            codeByExercise={progress.workbookCode}
            onCodeChange={updateWorkbookCode}
            onComplete={toggleWorkbookComplete}
            onSelectUnit={selectWorkbookUnit}
          />
        ) : mode === "exam" ? (
          <FinalTrainingView
            exercise={examExercise}
            completed={progress.examCompleted}
            codeByExercise={progress.examCode}
            copied={copied}
            onCodeChange={updateExamCode}
            onComplete={toggleExamComplete}
            onSelectExercise={selectExamExercise}
            onCopy={copyText}
          />
        ) : (
        <>
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
        </>
        )}
      </main>

      {showReset && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowReset(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-icon"><Trash2 /></div>
            <h2>重置全部学习进度？</h2>
            <p>教材、练习册与期末训练的完成状态、你写过的代码都会被清除。这个操作无法撤销。</p>
            <div><button className="secondary-button" onClick={() => setShowReset(false)}>先不重置</button><button className="danger-button" onClick={resetProgress}>确认重置</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
