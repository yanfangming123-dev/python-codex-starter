import { describe, expect, it } from "vitest";
import { codexFramework, lessons } from "./course";
import { examExerciseCount, examExercises } from "./exam";
import { intermediateExamExerciseCount } from "./intermediateExam";
import { intermediateWorkbookExerciseCount } from "./intermediateWorkbook";
import { learningTracks } from "./tracks";
import { workbookExerciseCount, workbookUnits } from "./workbook";

describe("course data", () => {
  it("contains eight complete lessons", () => {
    expect(lessons).toHaveLength(8);
    lessons.forEach((lesson, index) => {
      expect(lesson.number).toBe(index + 1);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exampleCode.length).toBeGreaterThan(5);
    });
  });

  it("uses unique lesson and exercise ids", () => {
    const lessonIds = lessons.map((lesson) => lesson.id);
    const exerciseIds = lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id));
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length);
  });

  it("teaches the four-part Codex question structure", () => {
    expect(codexFramework).toContain("我的目标");
    expect(codexFramework).toContain("我的代码");
    expect(codexFramework).toContain("实际结果");
    expect(codexFramework).toContain("期望结果");
  });

  it("provides a substantial companion workbook", () => {
    expect(workbookUnits).toHaveLength(8);
    expect(workbookExerciseCount).toBe(70);
    expect(workbookUnits[4].exercises).toHaveLength(10);
    expect(workbookUnits[5].exercises).toHaveLength(10);
    expect(workbookUnits[6].exercises).toHaveLength(10);
  });

  it("uses unique workbook ids and all five practice types", () => {
    const exercises = workbookUnits.flatMap((unit) => unit.exercises);
    expect(new Set(exercises.map((item) => item.id)).size).toBe(exercises.length);
    expect(new Set(exercises.map((item) => item.kind))).toEqual(new Set(["模仿", "补全", "改错", "独立", "综合"]));
  });

  it("adds a large chapterless final training bank", () => {
    expect(examExerciseCount).toBe(60);
    expect(new Set(examExercises.map((item) => item.id)).size).toBe(examExercises.length);
    expect(examExercises.every((item) => item.kind === "综合")).toBe(true);
    expect(examExercises.every((item) => item.title.length > 0 && item.task.length > 0)).toBe(true);
  });

  it("adds an intermediate track with the same three-part structure", () => {
    expect(learningTracks.map((track) => track.id)).toEqual(["beginner", "intermediate"]);
    const intermediate = learningTracks.find((track) => track.id === "intermediate");
    expect(intermediate?.lessons).toHaveLength(8);
    expect(intermediate?.workbookUnits).toHaveLength(8);
    expect(intermediateWorkbookExerciseCount).toBe(48);
    expect(intermediateExamExerciseCount).toBe(32);
  });
});
