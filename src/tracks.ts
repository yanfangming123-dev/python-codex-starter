import { lessons } from "./course";
import { examExercises } from "./exam";
import { intermediateLessons } from "./intermediateCourse";
import { intermediateExamExercises } from "./intermediateExam";
import { intermediateWorkbookUnits } from "./intermediateWorkbook";
import type { LearningTrack, TrackId } from "./types";
import { workbookUnits } from "./workbook";

export const learningTracks: LearningTrack[] = [
  {
    id: "beginner",
    title: "初级路线",
    shortTitle: "初级",
    levelLabel: "零基础",
    description: "从第一行 print() 开始，建立最基本的 Python 和 Codex 使用能力。",
    textbookLabel: "初级教材",
    workbookLabel: "配套练习",
    examLabel: "期末训练",
    heroBadge: "零基础友好",
    heroTone: "从能看懂开始",
    graduationTitle: "你已经不再是“完全不懂代码”的人了。",
    graduationText: "你能读懂基础 Python、拆分一个小问题、运行并检查代码，也知道怎样把上下文交给 Codex。下一步可以继续学习字典、文件、模块和真实自动化。",
    lessons,
    workbookUnits,
    examExercises
  },
  {
    id: "intermediate",
    title: "进阶路线",
    shortTitle: "进阶",
    levelLabel: "进阶",
    description: "从基础语法走向小型数据处理和真实工具雏形，重点练字典、文件思维、异常、模块和项目拆分。",
    textbookLabel: "进阶教材",
    workbookLabel: "进阶练习",
    examLabel: "进阶期末",
    heroBadge: "项目思维",
    heroTone: "从会写语法到会做工具",
    graduationTitle: "你已经具备进入高级版的地基。",
    graduationText: "你能处理列表里的字典、清洗小型数据、拆分函数、使用标准库，并且能把问题描述给 Codex 让它当教练。高级版可以进入文件自动化、API、网页数据和更完整的项目结构。",
    lessons: intermediateLessons,
    workbookUnits: intermediateWorkbookUnits,
    examExercises: intermediateExamExercises
  }
];

export const defaultTrack = learningTracks[0];

export function getTrack(id: TrackId | undefined) {
  return learningTracks.find((track) => track.id === id) ?? defaultTrack;
}
