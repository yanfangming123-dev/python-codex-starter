import type { Exercise, ValidationRule } from "./types";

const output = (...values: string[]): ValidationRule => ({ type: "outputIncludes", values });
const both = (out: string[], source: string[]): ValidationRule => ({ type: "both", output: out, code: source });

function task(
  id: string,
  title: string,
  task: string,
  starterCode: string,
  expected: string,
  answer: string,
  validation: ValidationRule
): Exercise {
  return {
    id: `mid-final-${id}`,
    kind: "综合",
    title,
    task,
    starterCode,
    expected,
    answer,
    validation,
    hints: ["先画出数据结构：是列表、字典，还是列表里放字典？", "把任务拆成清洗、统计、输出三步。", "遇到错误时，只把可能出错的小段放进 try。"]
  };
}

export const intermediateExamExercises: Exercise[] = [
  task("01", "学习记录汇总", "records 中有 topic 和 minutes，输出总分钟数。", `records = [{"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 40}]`, "输出总计70分钟。", `records = [{"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 40}]
total = 0
for record in records:
    total += record["minutes"]
print(f"总计{total}分钟")`, both(["总计70分钟"], ["for"])),
  task("02", "任务完成率", "tasks 中有 done，输出完成率。", `tasks = [{"done": True}, {"done": False}, {"done": True}]`, "输出完成率66.666。", `tasks = [{"done": True}, {"done": False}, {"done": True}]
done = 0
for task in tasks:
    if task["done"]:
        done += 1
print(f"完成率{done / len(tasks) * 100}%")`, both(["完成率66"], ["len"])),
  task("03", "安全分数清洗", "raw 中有坏数据，清洗后输出 [80, 90]。", `raw = ["80", "bad", "90"]`, "输出80和90。", `raw = ["80", "bad", "90"]
scores = []
for item in raw:
    try:
        scores.append(int(item))
    except ValueError:
        pass
print(scores)`, both(["80", "90"], ["try"])),
  task("04", "主题次数统计", "统计 topic 为“字典”的记录数。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}]`, "输出2。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}]
count = 0
for record in records:
    if record["topic"] == "字典":
        count += 1
print(count)`, both(["2"], ["if"])),
  task("05", "提取标题", "用推导式从 tasks 中提取 title。", `tasks = [{"title": "阅读"}, {"title": "复盘"}]`, "输出阅读和复盘。", `tasks = [{"title": "阅读"}, {"title": "复盘"}]
titles = [task["title"] for task in tasks]
print(titles)`, both(["阅读", "复盘"], ["for"])),
  task("06", "有效名字", "清洗 names，去掉空格和空项。", `names = [" 小林 ", "", "  ", "小周"]`, "输出小林和小周。", `names = [" 小林 ", "", "  ", "小周"]
clean_names = [name.strip() for name in names if name.strip()]
print(clean_names)`, both(["小林", "小周"], ["strip"])),
  task("07", "最高分记录", "输出最高分学生姓名。", `students = [{"name": "A", "score": 80}, {"name": "B", "score": 95}]`, "输出B。", `students = [{"name": "A", "score": 80}, {"name": "B", "score": 95}]
best = students[0]
for student in students:
    if student["score"] > best["score"]:
        best = student
print(best["name"])`, both(["B"], ["for", "if"])),
  task("08", "生成 Markdown", "把 items 转为 Markdown 清单文本。", `items = ["字典", "文件"]`, "输出 - 字典 和 - 文件。", `items = ["字典", "文件"]
lines = [f"- {item}" for item in items]
print("\\n".join(lines))`, both(["- 字典", "- 文件"], ["join"])),
  task("09", "安全读取字段", "user 没有 city，用 get 输出“未知城市”。", `user = {"name": "小林"}`, "输出未知城市。", `user = {"name": "小林"}
print(user.get("city", "未知城市"))`, both(["未知城市"], ["get"])),
  task("10", "按状态显示", "按 done 输出 ✓ 或 □。", `tasks = [{"title": "A", "done": True}, {"title": "B", "done": False}]`, "输出✓ A和□ B。", `tasks = [{"title": "A", "done": True}, {"title": "B", "done": False}]
for task in tasks:
    mark = "✓" if task["done"] else "□"
    print(f"{mark} {task['title']}")`, output("✓ A", "□ B")),
  task("11", "分组统计", "统计 records 中每个 topic 的总分钟。", `records = [{"topic": "A", "minutes": 10}, {"topic": "B", "minutes": 20}, {"topic": "A", "minutes": 30}]`, "输出A 40和B 20。", `records = [{"topic": "A", "minutes": 10}, {"topic": "B", "minutes": 20}, {"topic": "A", "minutes": 30}]
summary = {}
for record in records:
    topic = record["topic"]
    summary[topic] = summary.get(topic, 0) + record["minutes"]
for topic, minutes in summary.items():
    print(topic, minutes)`, both(["A 40", "B 20"], ["get", "items"])),
  task("12", "随机复习", "固定 seed 后从 topics 中抽题。", `topics = ["字典", "异常", "文件"]`, "输出一个主题，并使用 random。", `import random
topics = ["字典", "异常", "文件"]
random.seed(1)
print(random.choice(topics))`, both(["字典"], ["random.choice"])),
  task("13", "异常不中断", "values 中有 0，计算 10/value，跳过除零。", `values = [2, 0, 5]`, "输出5.0和2.0。", `values = [2, 0, 5]
for value in values:
    try:
        print(10 / value)
    except ZeroDivisionError:
        pass`, both(["5", "2"], ["ZeroDivisionError"])),
  task("14", "报告函数", "定义 report(records)，返回“共2条，总计70分钟”。", `records = [{"minutes": 30}, {"minutes": 40}]`, "输出共2条，总计70分钟。", `records = [{"minutes": 30}, {"minutes": 40}]
def report(records):
    total = 0
    for record in records:
        total += record["minutes"]
    return f"共{len(records)}条，总计{total}分钟"
print(report(records))`, both(["共2条，总计70分钟"], ["def", "return"])),
  task("15", "嵌套更新", "把第二个任务 done 改成 True。", `tasks = [{"title": "A", "done": False}, {"title": "B", "done": False}]`, "输出B True。", `tasks = [{"title": "A", "done": False}, {"title": "B", "done": False}]
tasks[1]["done"] = True
print(tasks[1]["title"], tasks[1]["done"])`, output("B True")),
  task("16", "清洗并平均", "raw_scores 有空格、空项和坏数据，输出平均85。", `raw_scores = [" 80", "", "bad", "90"]`, "输出85。", `raw_scores = [" 80", "", "bad", "90"]
scores = []
for item in raw_scores:
    try:
        scores.append(int(item.strip()))
    except ValueError:
        pass
print(sum(scores) / len(scores))`, both(["85"], ["strip", "try"])),
  task("17", "生成编号", "用 enumerate 输出 1. A 和 2. B。", `items = ["A", "B"]`, "输出编号。", `items = ["A", "B"]
for index, item in enumerate(items, start=1):
    print(f"{index}. {item}")`, both(["1. A", "2. B"], ["enumerate"])),
  task("18", "字段缺失报告", "records 中缺少 score 的输出“缺少分数”。", `records = [{"name": "A", "score": 80}, {"name": "B"}]`, "输出80和缺少分数。", `records = [{"name": "A", "score": 80}, {"name": "B"}]
for record in records:
    try:
        print(record["score"])
    except KeyError:
        print("缺少分数")`, both(["80", "缺少分数"], ["KeyError"])),
  task("19", "筛选长任务", "输出标题长度大于2的任务。", `tasks = [{"title": "读"}, {"title": "练Python"}]`, "输出练Python。", `tasks = [{"title": "读"}, {"title": "练Python"}]
long_tasks = [task["title"] for task in tasks if len(task["title"]) > 2]
print(long_tasks)`, both(["练Python"], ["len"])),
  task("20", "学习天数", "从多行文本中统计非空行数量。", `text = "周一\\n\\n周三\\n "`, "输出2。", `text = "周一\\n\\n周三\\n "
days = [line.strip() for line in text.split("\\n") if line.strip()]
print(len(days))`, both(["2"], ["split", "strip"])),
  task("21", "字典转文本", "把 profile 输出成 key=value 多行文本。", `profile = {"name": "小林", "level": "进阶"}`, "输出name=小林和level=进阶。", `profile = {"name": "小林", "level": "进阶"}
for key, value in profile.items():
    print(f"{key}={value}")`, both(["name=小林", "level=进阶"], ["items"])),
  task("22", "新增默认值", "如果 summary 没有 topic，就从 0 开始累加。", `records = [{"topic": "A", "minutes": 10}, {"topic": "A", "minutes": 5}]`, "输出15。", `records = [{"topic": "A", "minutes": 10}, {"topic": "A", "minutes": 5}]
summary = {}
for record in records:
    topic = record["topic"]
    summary[topic] = summary.get(topic, 0) + record["minutes"]
print(summary["A"])`, both(["15"], ["get"])),
  task("23", "模块计算", "用 math.sqrt 计算 81 的平方根。", "", "输出9。", `import math
print(math.sqrt(81))`, both(["9"], ["math.sqrt"])),
  task("24", "今日报告", "使用 date.today 输出“日期：今天”。", "", "输出日期：。", `from datetime import date
print(f"日期：{date.today()}")`, both(["日期："], ["date.today"])),
  task("25", "格式化记录", "定义 format_record，输出“周一｜字典｜30分钟”。", "", "输出格式化文本。", `def format_record(record):
    return f"{record['day']}｜{record['topic']}｜{record['minutes']}分钟"
print(format_record({"day": "周一", "topic": "字典", "minutes": 30}))`, both(["周一｜字典｜30分钟"], ["def"])),
  task("26", "只保留通过者", "用推导式保留 score>=60 的学生姓名。", `students = [{"name": "A", "score": 50}, {"name": "B", "score": 80}]`, "输出B。", `students = [{"name": "A", "score": 50}, {"name": "B", "score": 80}]
passed = [student["name"] for student in students if student["score"] >= 60]
print(passed)`, both(["B"], ["if"])),
  task("27", "修复字段访问", "修复代码，输出文件。", `record = {"topic": "文件"}
print(record[topic])`, "输出文件。", `record = {"topic": "文件"}
print(record["topic"])`, output("文件")),
  task("28", "修复返回值", "修复函数，输出总计30。", `def total(records):
    result = 0
    for record in records:
        result += record["minutes"]
print(total([{"minutes": 30}]))`, "输出30。", `def total(records):
    result = 0
    for record in records:
        result += record["minutes"]
    return result
print(total([{"minutes": 30}]))`, both(["30"], ["return"])),
  task("29", "文本到记录", "把 '字典,30' 拆成字典并输出。", `line = "字典,30"`, "输出topic字典和minutes30。", `line = "字典,30"
topic, minutes = line.split(",")
record = {"topic": topic, "minutes": int(minutes)}
print(record)`, both(["字典", "30"], ["split"])),
  task("30", "记录到文本", "把 record 转成 '字典,30'。", `record = {"topic": "字典", "minutes": 30}`, "输出字典,30。", `record = {"topic": "字典", "minutes": 30}
print(f"{record['topic']},{record['minutes']}")`, output("字典,30")),
  task("31", "小型分析器", "定义 total_by_topic(records, topic)，输出文件主题总分钟。", `records = [{"topic": "文件", "minutes": 20}, {"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 10}]`, "输出30。", `records = [{"topic": "文件", "minutes": 20}, {"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 10}]
def total_by_topic(records, topic):
    total = 0
    for record in records:
        if record["topic"] == topic:
            total += record["minutes"]
    return total
print(total_by_topic(records, "文件"))`, both(["30"], ["def", "return"])),
  task("32", "进阶结课项目", "建立 records，定义 add_record 和 report，添加两条后输出总计70分钟。", "", "输出总计70分钟。", `records = []
def add_record(day, topic, minutes):
    records.append({"day": day, "topic": topic, "minutes": minutes})
def report():
    total = 0
    for record in records:
        total += record["minutes"]
    return f"总计{total}分钟"
add_record("周一", "字典", 30)
add_record("周二", "文件", 40)
print(report())`, both(["总计70分钟"], ["def", "append", "return"]))
];

export const intermediateExamExerciseCount = intermediateExamExercises.length;
