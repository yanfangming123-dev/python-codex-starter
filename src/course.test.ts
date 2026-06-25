import { describe, expect, it } from "vitest";
import { codexFramework, lessons } from "./course";

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
});
