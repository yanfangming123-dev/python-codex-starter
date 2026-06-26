import type { Exercise, ValidationRule, WorkbookUnit } from "./types";

const output = (...values: string[]): ValidationRule => ({ type: "outputIncludes", values });
const both = (out: string[], source: string[]): ValidationRule => ({ type: "both", output: out, code: source });

function ex(
  id: string,
  kind: Exercise["kind"],
  title: string,
  task: string,
  starterCode: string,
  expected: string,
  answer: string,
  validation: ValidationRule
): Exercise {
  return {
    id: `mid-wb-${id}`,
    kind,
    title,
    task,
    starterCode,
    expected,
    answer,
    validation,
    hints: ["先确认数据长什么样，再决定用列表、字典还是函数。", "写完后用 print() 看中间结果，不要只盯最终答案。", "检查冒号、缩进、键名和字符串引号。"]
  };
}

export const intermediateWorkbookUnits: WorkbookUnit[] = [
  {
    id: "mid-wb-dict",
    number: 1,
    title: "字典强化训练",
    subtitle: "把带标签的信息拿稳",
    focus: ["创建字典", "读取与修改", "items() 遍历"],
    exercises: [
      ex("d1", "模仿", "创建书籍信息", "创建 book，包含 title 和 price，输出“Python入门 39”。", "", "输出书名和价格。", `book = {"title": "Python入门", "price": 39}
print(book["title"], book["price"])`, output("Python入门", "39")),
      ex("d2", "补全", "更新库存", "把 stock 的 count 改成 8。", `stock = {"name": "铅笔", "count": 5}
# 修改
print(stock["count"])`, "输出 8。", `stock = {"name": "铅笔", "count": 5}
stock["count"] = 8
print(stock["count"])`, output("8")),
      ex("d3", "改错", "键名不是变量", "修复代码，输出杭州。", `user = {"city": "杭州"}
print(user[city])`, "输出杭州。", `user = {"city": "杭州"}
print(user["city"])`, output("杭州")),
      ex("d4", "独立", "遍历资料", "遍历 profile，输出每个键和值。", `profile = {"name": "小周", "level": "进阶"}`, "输出 name、小周、level、进阶。", `profile = {"name": "小周", "level": "进阶"}
for key, value in profile.items():
    print(key, value)`, both(["name", "小周", "level", "进阶"], ["items"])),
      ex("d5", "独立", "安全读取", "用 get 读取不存在的 age，默认值为“未知”。", `user = {"name": "小青"}`, "输出未知。", `user = {"name": "小青"}
print(user.get("age", "未知"))`, both(["未知"], ["get"])),
      ex("d6", "综合", "成绩报告", "student 包含 name 和 score，根据 score 输出“小白：通过”。", `student = {"name": "小白", "score": 76}`, "输出小白：通过。", `student = {"name": "小白", "score": 76}
status = "通过" if student["score"] >= 60 else "继续努力"
print(f"{student['name']}：{status}")`, output("小白：通过"))
    ]
  },
  {
    id: "mid-wb-nested",
    number: 2,
    title: "嵌套数据强化训练",
    subtitle: "处理一组真实记录",
    focus: ["列表里的字典", "筛选", "汇总"],
    exercises: [
      ex("n1", "模仿", "输出任务标题", "遍历 tasks，输出每个 title。", `tasks = [{"title": "阅读"}, {"title": "练习"}]`, "输出阅读和练习。", `tasks = [{"title": "阅读"}, {"title": "练习"}]
for task in tasks:
    print(task["title"])`, both(["阅读", "练习"], ["for"])),
      ex("n2", "补全", "筛选已完成", "只输出 done 为 True 的任务。", `tasks = [{"title": "阅读", "done": True}, {"title": "练习", "done": False}]`, "输出阅读。", `tasks = [{"title": "阅读", "done": True}, {"title": "练习", "done": False}]
for task in tasks:
    if task["done"]:
        print(task["title"])`, both(["阅读"], ["if"])),
      ex("n3", "改错", "修复字段名", "修复代码，输出 90。", `students = [{"name": "A", "score": 90}]
print(students[0]["scores"])`, "输出90。", `students = [{"name": "A", "score": 90}]
print(students[0]["score"])`, output("90")),
      ex("n4", "独立", "统计未完成数", "统计 tasks 中 done 为 False 的数量。", `tasks = [{"done": True}, {"done": False}, {"done": False}]`, "输出2。", `tasks = [{"done": True}, {"done": False}, {"done": False}]
count = 0
for task in tasks:
    if not task["done"]:
        count += 1
print(count)`, both(["2"], ["not"])),
      ex("n5", "独立", "找最高分姓名", "输出最高分学生的 name。", `students = [{"name": "小林", "score": 80}, {"name": "小周", "score": 95}]`, "输出小周。", `students = [{"name": "小林", "score": 80}, {"name": "小周", "score": 95}]
best = students[0]
for student in students:
    if student["score"] > best["score"]:
        best = student
print(best["name"])`, both(["小周"], ["for", "if"])),
      ex("n6", "综合", "生成任务看板", "逐项输出 ✓/□ 和标题。", `tasks = [{"title": "阅读", "done": True}, {"title": "复盘", "done": False}]`, "输出 ✓ 阅读 和 □ 复盘。", `tasks = [{"title": "阅读", "done": True}, {"title": "复盘", "done": False}]
for task in tasks:
    mark = "✓" if task["done"] else "□"
    print(f"{mark} {task['title']}")`, output("✓ 阅读", "□ 复盘"))
    ]
  },
  {
    id: "mid-wb-comprehension",
    number: 3,
    title: "推导式强化训练",
    subtitle: "把简单转换写清楚",
    focus: ["转换", "筛选", "保持可读"],
    exercises: [
      ex("c1", "模仿", "数字翻倍", "用推导式生成 [2,4,6]。", `numbers = [1, 2, 3]`, "输出 2、4、6。", `numbers = [1, 2, 3]
doubled = [number * 2 for number in numbers]
print(doubled)`, both(["2", "4", "6"], ["for"])),
      ex("c2", "补全", "提取名字", "从 users 中提取 name 列表。", `users = [{"name": "A"}, {"name": "B"}]`, "输出 A 和 B。", `users = [{"name": "A"}, {"name": "B"}]
names = [user["name"] for user in users]
print(names)`, both(["A", "B"], ["for"])),
      ex("c3", "改错", "筛选条件位置", "修复推导式，筛选大于 3 的数字。", `numbers = [1, 4, 5]
big = [number if number > 3 for number in numbers]
print(big)`, "输出4和5。", `numbers = [1, 4, 5]
big = [number for number in numbers if number > 3]
print(big)`, both(["4", "5"], ["if"])),
      ex("c4", "独立", "转成大写", "把 words 全部转成大写。", `words = ["py", "codex"]`, "输出 PY 和 CODEX。", `words = ["py", "codex"]
upper_words = [word.upper() for word in words]
print(upper_words)`, both(["PY", "CODEX"], ["upper"])),
      ex("c5", "独立", "筛选有效名字", "去掉空字符串和空格项。", `names = ["小林", "", "  ", "小周"]`, "输出小林和小周。", `names = ["小林", "", "  ", "小周"]
clean = [name.strip() for name in names if name.strip()]
print(clean)`, both(["小林", "小周"], ["strip"])),
      ex("c6", "综合", "生成展示行", "把 tasks 转成“1. 阅读”这样的行。", `tasks = ["阅读", "练习"]`, "输出1. 阅读和2. 练习。", `tasks = ["阅读", "练习"]
lines = [f"{index}. {task}" for index, task in enumerate(tasks, start=1)]
print(lines)`, both(["1. 阅读", "2. 练习"], ["enumerate"]))
    ]
  },
  {
    id: "mid-wb-errors",
    number: 4,
    title: "异常处理强化训练",
    subtitle: "把可能出错的地方圈出来",
    focus: ["try", "except", "错误类型"],
    exercises: [
      ex("e1", "模仿", "转换失败", "捕获 int('x') 的 ValueError。", `text = "x"`, "输出不是数字。", `text = "x"
try:
    print(int(text))
except ValueError:
    print("不是数字")`, both(["不是数字"], ["try", "except"])),
      ex("e2", "补全", "安全索引", "读取列表第 5 项，失败输出越界。", `items = ["A"]`, "输出越界。", `items = ["A"]
try:
    print(items[5])
except IndexError:
    print("越界")`, both(["越界"], ["IndexError"])),
      ex("e3", "改错", "捕获正确错误", "修复 except 类型。", `data = {"name": "A"}
try:
    print(data["age"])
except ValueError:
    print("缺少字段")`, "输出缺少字段。", `data = {"name": "A"}
try:
    print(data["age"])
except KeyError:
    print("缺少字段")`, both(["缺少字段"], ["KeyError"])),
      ex("e4", "独立", "跳过坏数据", "把 raw 中能转数字的加入 numbers。", `raw = ["10", "bad", "20"]`, "输出10和20。", `raw = ["10", "bad", "20"]
numbers = []
for item in raw:
    try:
        numbers.append(int(item))
    except ValueError:
        pass
print(numbers)`, both(["10", "20"], ["try", "pass"])),
      ex("e5", "独立", "友好除法", "10 除以 0 时输出不能除以0。", "", "输出不能除以0。", `try:
    print(10 / 0)
except ZeroDivisionError:
    print("不能除以0")`, both(["不能除以0"], ["ZeroDivisionError"])),
      ex("e6", "综合", "安全平均分", "raw_scores 中有坏数据，清洗后输出平均 85。", `raw_scores = ["80", "bad", "90"]`, "输出85。", `raw_scores = ["80", "bad", "90"]
scores = []
for item in raw_scores:
    try:
        scores.append(int(item))
    except ValueError:
        pass
print(sum(scores) / len(scores))`, both(["85"], ["try", "sum"]))
    ]
  },
  {
    id: "mid-wb-files",
    number: 5,
    title: "文件文本强化训练",
    subtitle: "先练文本，再接真实文件",
    focus: ["split", "join", "逐行处理"],
    exercises: [
      ex("f1", "模仿", "拆行", "把三行文本拆成列表。", `text = "A\\nB\\nC"`, "输出 A、B、C。", `text = "A\\nB\\nC"
lines = text.split("\\n")
print(lines)`, both(["A", "B", "C"], ["split"])),
      ex("f2", "补全", "拼行", "把 items 用换行连接。", `items = ["A", "B", "C"]`, "输出三行。", `items = ["A", "B", "C"]
text = "\\n".join(items)
print(text)`, both(["A", "B", "C"], ["join"])),
      ex("f3", "改错", "换行符", "修复代码，让它按换行拆分。", `text = "A\\nB"
print(text.split("/n"))`, "输出 A 和 B。", `text = "A\\nB"
print(text.split("\\n"))`, both(["A", "B"], ["\\\\n"])),
      ex("f4", "独立", "编号文本", "把每一行变成带编号的输出。", `text = "阅读\\n练习"`, "输出1. 阅读和2. 练习。", `text = "阅读\\n练习"
for index, line in enumerate(text.split("\\n"), start=1):
    print(f"{index}. {line}")`, both(["1. 阅读", "2. 练习"], ["enumerate"])),
      ex("f5", "独立", "过滤空行", "去掉文本中的空行。", `text = "A\\n\\nB\\n "`, "输出 A 和 B。", `text = "A\\n\\nB\\n "
lines = []
for line in text.split("\\n"):
    clean = line.strip()
    if clean:
        lines.append(clean)
print(lines)`, both(["A", "B"], ["strip"])),
      ex("f6", "综合", "生成 Markdown 清单", "把 tasks 变成 - 阅读 这样的 Markdown 文本。", `tasks = ["阅读", "练习"]`, "输出 - 阅读 和 - 练习。", `tasks = ["阅读", "练习"]
lines = [f"- {task}" for task in tasks]
print("\\n".join(lines))`, both(["- 阅读", "- 练习"], ["join"]))
    ]
  },
  {
    id: "mid-wb-modules",
    number: 6,
    title: "模块标准库强化训练",
    subtitle: "把工具箱用起来",
    focus: ["random", "datetime", "math"],
    exercises: [
      ex("m1", "模仿", "向上取整", "用 math.ceil 输出 4。", `number = 3.2`, "输出4。", `import math
number = 3.2
print(math.ceil(number))`, both(["4"], ["import math"])),
      ex("m2", "补全", "随机抽题", "用 random.choice 抽一个题目。", `questions = ["A", "B", "C"]`, "输出 A/B/C 中一项。", `import random
questions = ["A", "B", "C"]
print(random.choice(questions))`, both([""], ["random.choice"])),
      ex("m3", "改错", "导入名称", "修复代码，输出平方根 4。", `import maths
print(maths.sqrt(16))`, "输出4。", `import math
print(math.sqrt(16))`, both(["4"], ["math.sqrt"])),
      ex("m4", "独立", "今天日期", "用 date.today() 输出今天。", "", "输出日期，并使用 datetime。", `from datetime import date
print(date.today())`, both(["-"], ["datetime", "date.today"])),
      ex("m5", "独立", "固定随机", "设置 random.seed(1)，再从列表抽取一项。", `items = ["红", "黄", "蓝"]`, "输出某个颜色，并使用 seed。", `import random
items = ["红", "黄", "蓝"]
random.seed(1)
print(random.choice(items))`, both(["红"], ["seed"])),
      ex("m6", "综合", "抽取复习题", "从 topics 随机抽一个，输出“今天复习：主题”。", `topics = ["字典", "异常", "文件"]`, "输出今天复习。", `import random
topics = ["字典", "异常", "文件"]
print(f"今天复习：{random.choice(topics)}")`, both(["今天复习："], ["random.choice"]))
    ]
  },
  {
    id: "mid-wb-data",
    number: 7,
    title: "数据处理强化训练",
    subtitle: "清洗、统计、报告三步走",
    focus: ["清洗", "统计", "报告"],
    exercises: [
      ex("data1", "模仿", "去空格", "清洗一个名字。", `name = " 小林 "`, "输出小林。", `name = " 小林 "
print(name.strip())`, both(["小林"], ["strip"])),
      ex("data2", "补全", "清洗列表", "去掉空字符串。", `items = ["A", "", "B"]`, "输出A和B。", `items = ["A", "", "B"]
clean = []
for item in items:
    if item:
        clean.append(item)
print(clean)`, both(["A", "B"], ["append"])),
      ex("data3", "改错", "字符串数字", "修复代码，输出 30。", `values = ["10", "20"]
print(values[0] + values[1])`, "输出30。", `values = ["10", "20"]
print(int(values[0]) + int(values[1]))`, both(["30"], ["int"])),
      ex("data4", "独立", "平均分钟数", "records 中有 minutes，计算平均值。", `records = [{"minutes": 30}, {"minutes": 50}]`, "输出40。", `records = [{"minutes": 30}, {"minutes": 50}]
total = 0
for record in records:
    total += record["minutes"]
print(total / len(records))`, both(["40"], ["for"])),
      ex("data5", "独立", "主题汇总", "统计 topic 为 字典 的次数。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}]`, "输出2。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}]
count = 0
for record in records:
    if record["topic"] == "字典":
        count += 1
print(count)`, both(["2"], ["if"])),
      ex("data6", "综合", "生成一句报告", "输出“共2条，合计70分钟”。", `records = [{"minutes": 30}, {"minutes": 40}]`, "输出共2条，合计70分钟。", `records = [{"minutes": 30}, {"minutes": 40}]
total = 0
for record in records:
    total += record["minutes"]
print(f"共{len(records)}条，合计{total}分钟")`, both(["共2条，合计70分钟"], ["len"]))
    ]
  },
  {
    id: "mid-wb-project",
    number: 8,
    title: "进阶项目拆解训练",
    subtitle: "把小工具拆成函数",
    focus: ["函数拆分", "列表字典", "报告输出"],
    exercises: [
      ex("p1", "模仿", "添加记录函数", "定义 add_record，向 records 添加一条字典。", `records = []`, "输出包含字典的列表。", `records = []
def add_record(topic, minutes):
    records.append({"topic": topic, "minutes": minutes})
add_record("字典", 30)
print(records)`, both(["字典", "30"], ["def", "append"])),
      ex("p2", "补全", "总时长函数", "定义 total_minutes 返回总分钟。", `records = [{"minutes": 30}, {"minutes": 40}]`, "输出70。", `records = [{"minutes": 30}, {"minutes": 40}]
def total_minutes():
    total = 0
    for record in records:
        total += record["minutes"]
    return total
print(total_minutes())`, both(["70"], ["return"])),
      ex("p3", "改错", "函数要返回", "修复函数，让输出为2。", `records = [1, 2]
def count_records():
    len(records)
print(count_records())`, "输出2。", `records = [1, 2]
def count_records():
    return len(records)
print(count_records())`, both(["2"], ["return"])),
      ex("p4", "独立", "按主题筛选函数", "定义 filter_topic(topic)，返回匹配记录列表。", `records = [{"topic": "字典"}, {"topic": "文件"}]`, "输出只包含字典记录。", `records = [{"topic": "字典"}, {"topic": "文件"}]
def filter_topic(topic):
    result = []
    for record in records:
        if record["topic"] == topic:
            result.append(record)
    return result
print(filter_topic("字典"))`, both(["字典"], ["def", "return"])),
      ex("p5", "独立", "报告函数", "定义 report 返回“共2条记录”。", `records = [{"topic": "A"}, {"topic": "B"}]`, "输出共2条记录。", `records = [{"topic": "A"}, {"topic": "B"}]
def report():
    return f"共{len(records)}条记录"
print(report())`, both(["共2条记录"], ["def"])),
      ex("p6", "综合", "学习记录小工具", "组合 add_record 和 report，添加两条后输出总分钟。", "", "输出总计70分钟。", `records = []
def add_record(topic, minutes):
    records.append({"topic": topic, "minutes": minutes})
def report():
    total = 0
    for record in records:
        total += record["minutes"]
    return f"总计{total}分钟"
add_record("字典", 30)
add_record("文件", 40)
print(report())`, both(["总计70分钟"], ["def", "append", "return"]))
    ]
  }
];

export const intermediateWorkbookExerciseCount = intermediateWorkbookUnits.reduce((sum, unit) => sum + unit.exercises.length, 0);
