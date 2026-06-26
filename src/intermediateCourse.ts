import type { Exercise, Lesson, ValidationRule } from "./types";

const output = (...values: string[]): ValidationRule => ({ type: "outputIncludes", values });
const code = (...values: string[]): ValidationRule => ({ type: "codeIncludes", values });
const both = (out: string[], source: string[]): ValidationRule => ({ type: "both", output: out, code: source });

function ex(
  id: string,
  title: string,
  task: string,
  starterCode: string,
  expected: string,
  answer: string,
  validation: ValidationRule,
  hints: string[]
): Exercise {
  return { id: `mid-${id}`, title, task, starterCode, expected, answer, validation, kind: "综合", hints };
}

const codexTip = (topic: string) =>
  `请用进阶初学者能懂的方式解释“${topic}”。先帮我判断代码思路，不要直接给完整答案；请指出我应该打印哪些中间变量来检查。`;

export const intermediateLessons: Lesson[] = [
  {
    id: "mid-dict",
    number: 1,
    title: "字典：给信息贴标签",
    eyebrow: "DICTIONARY",
    duration: "25–35 分钟",
    goal: "学会用字典保存一组有名字的信息，并用键读取、修改和遍历。",
    analogy: "列表像一排储物柜，只能按号码找；字典像带标签的文件夹，可以直接按“姓名”“城市”“分数”找到内容。",
    explanation: [
      "字典用花括号 `{}` 表示，每一项都是 `键: 值`。键通常是字符串，值可以是文字、数字、列表，甚至另一个字典。",
      "进阶学习里，字典很重要，因为真实数据很少只是单个数字。一个任务、一条学生记录、一件商品，都更像一组带标签的信息。",
      "读字典时用 `user[\"name\"]`。如果键不存在会报错，所以后来我们会学习更安全的 `.get()`。"
    ],
    keyPoints: ["键值对保存结构化信息", "用键读取和修改值", "循环可以遍历字典"],
    exampleCode: `student = {"name": "小林", "score": 88, "city": "杭州"}
print(student["name"])
student["score"] = 92
for key, value in student.items():
    print(f"{key}: {value}")`,
    exercises: [
      ex("d1", "制作个人资料卡", "创建 profile 字典，包含 name、city、level，并输出“阿宁 来自 成都”。", "", "输出阿宁 来自 成都。", `profile = {"name": "阿宁", "city": "成都", "level": "进阶"}
print(f"{profile['name']} 来自 {profile['city']}")`, both(["阿宁 来自 成都"], ["profile", "{", "}"]), ["先写出三个键。", "f-string 里可以放 profile['name']。"]),
      ex("d2", "统计任务状态", "已有 task 字典，把 done 从 False 改成 True，并输出“复盘 已完成”。", `task = {"title": "复盘", "done": False}
# 修改并输出`, "输出复盘 已完成。", `task = {"title": "复盘", "done": False}
task["done"] = True
status = "已完成" if task["done"] else "未完成"
print(f"{task['title']} {status}")`, both(["复盘 已完成"], ["task[\"done\"]"]), ["修改字典值的写法和变量重新赋值很像。", "布尔值可以放进 if 或三元表达式里。"])
    ],
    codexTip: codexTip("字典")
  },
  {
    id: "mid-nested",
    number: 2,
    title: "嵌套数据：列表里放字典",
    eyebrow: "NESTED DATA",
    duration: "30–40 分钟",
    goal: "看懂并处理“多条记录”，例如任务列表、成绩表和商品清单。",
    analogy: "如果一个字典是一张学生卡片，那么“列表里放字典”就是一叠学生卡片。你可以一张张翻，看每张卡上的姓名和分数。",
    explanation: [
      "真实小项目经常会遇到 `[{...}, {...}]` 这样的结构：外层列表表示很多条记录，内层字典表示每条记录的字段。",
      "处理这种数据通常是两步：先 `for item in items` 拿到一条记录，再用 `item[\"字段名\"]` 读取具体信息。",
      "这也是你从“写语法”走向“处理数据”的关键一步。"
    ],
    keyPoints: ["外层列表负责多条记录", "内层字典负责每条记录", "循环和条件可以组合筛选"],
    exampleCode: `tasks = [
    {"title": "阅读", "done": True},
    {"title": "练习", "done": False},
    {"title": "复盘", "done": False}
]
for task in tasks:
    mark = "✓" if task["done"] else "□"
    print(f"{mark} {task['title']}")`,
    exercises: [
      ex("n1", "显示未完成任务", "只输出 done 为 False 的任务标题。", `tasks = [
    {"title": "阅读", "done": True},
    {"title": "练习", "done": False},
    {"title": "复盘", "done": False}
]`, "输出练习和复盘。", `tasks = [
    {"title": "阅读", "done": True},
    {"title": "练习", "done": False},
    {"title": "复盘", "done": False}
]
for task in tasks:
    if not task["done"]:
        print(task["title"])`, both(["练习", "复盘"], ["for", "if"]), ["先循环每个 task。", "`not task['done']` 表示还没完成。"]),
      ex("n2", "计算平均分", "students 中每人有 score，用循环计算平均分。", `students = [
    {"name": "小白", "score": 80},
    {"name": "小青", "score": 90}
]`, "输出 85。", `students = [
    {"name": "小白", "score": 80},
    {"name": "小青", "score": 90}
]
total = 0
for student in students:
    total += student["score"]
print(total / len(students))`, both(["85"], ["for", "len"]), ["先把总分加起来。", "平均分 = 总分 / 人数。"])
    ],
    codexTip: codexTip("嵌套数据")
  },
  {
    id: "mid-comprehension",
    number: 3,
    title: "推导式：把循环写短一点",
    eyebrow: "COMPREHENSION",
    duration: "25–35 分钟",
    goal: "理解列表推导式，不追求炫技，只用它写清楚的转换和筛选。",
    analogy: "普通循环像一步步手工装信封；推导式像一条清楚的流水线：从哪里来、怎么加工、要不要筛掉。",
    explanation: [
      "列表推导式形如 `[表达式 for 变量 in 列表]`，常用于把一组数据转换成另一组数据。",
      "加上 `if` 后可以筛选：`[x for x in numbers if x > 0]`。",
      "进阶阶段要记住：推导式是为了清楚，不是为了把所有东西都写成一行。复杂时仍然用普通循环。"
    ],
    keyPoints: ["转换数据", "筛选数据", "复杂逻辑仍用普通循环"],
    exampleCode: `numbers = [1, 2, 3, 4]
squares = [number * number for number in numbers]
evens = [number for number in numbers if number % 2 == 0]
print(squares)
print(evens)`,
    exercises: [
      ex("c1", "生成长度列表", "用推导式得到每个单词的长度。", `words = ["Python", "Codex", "AI"]`, "输出 [6, 5, 2]。", `words = ["Python", "Codex", "AI"]
lengths = [len(word) for word in words]
print(lengths)`, both(["6", "5", "2"], ["for", "len"]), ["表达式是 len(word)。", "结果仍然是一个列表。"]),
      ex("c2", "筛选高分", "用推导式筛选出 scores 中大于等于 80 的分数。", `scores = [59, 80, 92, 70]`, "输出 80 和 92。", `scores = [59, 80, 92, 70]
good_scores = [score for score in scores if score >= 80]
print(good_scores)`, both(["80", "92"], ["if"]), ["先写不带 if 的版本。", "最后加上 `if score >= 80`。"])
    ],
    codexTip: codexTip("列表推导式")
  },
  {
    id: "mid-errors",
    number: 4,
    title: "异常处理：让程序优雅失败",
    eyebrow: "ERROR HANDLING",
    duration: "30–40 分钟",
    goal: "理解 try / except，在输入或数据不可靠时给出友好的处理。",
    analogy: "异常处理像安全网。不是为了让你随便乱跳，而是当某一步可能摔倒时，程序能接住自己并说明发生了什么。",
    explanation: [
      "程序出错会抛出异常。进阶阶段，我们不只是看报错，还要学会预测哪些地方可能出错。",
      "`try` 放可能出错的代码，`except` 放出错后的处理。常见错误包括 `ValueError`、`KeyError`、`IndexError`。",
      "不要把所有代码都塞进 try。只包住真正可能出错的小段，程序才容易调试。"
    ],
    keyPoints: ["try 包住风险代码", "except 处理指定错误", "不要吞掉所有问题"],
    exampleCode: `text = "42"
try:
    number = int(text)
    print(number * 2)
except ValueError:
    print("这不是一个数字")`,
    exercises: [
      ex("e1", "安全转换数字", "text='abc'，尝试转成整数；失败时输出“无法转换”。", `text = "abc"`, "输出无法转换。", `text = "abc"
try:
    number = int(text)
    print(number)
except ValueError:
    print("无法转换")`, both(["无法转换"], ["try", "except"]), ["int('abc') 会出错。", "捕获 ValueError。"]),
      ex("e2", "安全读取字典", "user 没有 age，捕获 KeyError 并输出“缺少年龄”。", `user = {"name": "小林"}`, "输出缺少年龄。", `user = {"name": "小林"}
try:
    print(user["age"])
except KeyError:
    print("缺少年龄")`, both(["缺少年龄"], ["KeyError"]), ["访问不存在的键会触发 KeyError。", "except 后面写错误类型。"])
    ],
    codexTip: codexTip("异常处理")
  },
  {
    id: "mid-files",
    number: 5,
    title: "文件思维：读写文本",
    eyebrow: "FILES",
    duration: "30–45 分钟",
    goal: "理解文件读写的基本模式，为之后做真实自动化打基础。",
    analogy: "变量像便签，程序结束就没了；文件像笔记本，写进去以后，下次还能再打开。",
    explanation: [
      "在浏览器练习环境里，我们重点学习文件思维：文本如何变成列表，列表如何整理成多行文本。",
      "真实 Python 中常用 `with open(...) as file` 读写文件。它会自动帮你关文件，减少错误。",
      "文件自动化的核心常常是：读取文本、逐行处理、生成新的文本。"
    ],
    keyPoints: ["文本可以按行拆分", "列表可以组合成文本", "with open 是真实文件读写常用模式"],
    exampleCode: `text = "阅读\\n练习\\n复盘"
lines = text.split("\\n")
for index, line in enumerate(lines, start=1):
    print(f"{index}. {line}")`,
    exercises: [
      ex("f1", "拆分多行文本", "把 text 拆成多行，并逐行输出。", `text = "苹果\\n香蕉\\n橙子"`, "输出苹果、香蕉、橙子。", `text = "苹果\\n香蕉\\n橙子"
items = text.split("\\n")
for item in items:
    print(item)`, both(["苹果", "香蕉", "橙子"], ["split"]), ["换行符写作 `\\n`。", "split 后得到列表。"]),
      ex("f2", "组合报告文本", "把 tasks 列表组合成用换行分隔的文本并输出。", `tasks = ["阅读", "练习", "复盘"]`, "输出三行文本。", `tasks = ["阅读", "练习", "复盘"]
report = "\\n".join(tasks)
print(report)`, both(["阅读", "练习", "复盘"], ["join"]), ["join 是 split 的反向动作。", "`'\\n'.join(...)` 表示用换行连接。"])
    ],
    codexTip: codexTip("文件读写思维")
  },
  {
    id: "mid-modules",
    number: 6,
    title: "模块与库：借用工具箱",
    eyebrow: "MODULES",
    duration: "25–35 分钟",
    goal: "学会 import 标准库，并知道如何向 Codex 描述库的使用目标。",
    analogy: "自己写代码像手工做工具；导入模块像打开工具箱。你不需要亲手造锤子，但要知道什么时候该拿锤子。",
    explanation: [
      "`import` 可以导入别人已经写好的工具。Python 自带很多标准库，比如 `random`、`datetime`、`math`。",
      "使用库时，最重要的是先讲清楚目标：我要随机抽题、处理日期、计算平均数，而不是只问“这个库怎么用”。",
      "进阶版开始，你会越来越多地让 Codex 帮你查库和解释文档。"
    ],
    keyPoints: ["import 导入模块", "标准库不需要额外安装", "向 Codex 描述目标比背 API 更重要"],
    exampleCode: `import random

questions = ["字典", "文件", "异常"]
print(random.choice(questions))`,
    exercises: [
      ex("m1", "随机抽取任务", "使用 random.choice 从 tasks 中抽取一项并输出。", `tasks = ["阅读", "练习", "复盘"]`, "输出 tasks 中的某一项，并使用 random。", `import random

tasks = ["阅读", "练习", "复盘"]
print(random.choice(tasks))`, both([""], ["import random", "choice"]), ["先 import random。", "random.choice(列表) 会随机返回一项。"]),
      ex("m2", "获取今天日期", "使用 datetime 输出今天日期。", "", "输出今天日期，并使用 datetime。", `from datetime import date

today = date.today()
print(today)`, code("datetime", "date.today"), ["可以 `from datetime import date`。", "date.today() 会得到今天。"])
    ],
    codexTip: codexTip("模块和标准库")
  },
  {
    id: "mid-data",
    number: 7,
    title: "小型数据处理：清洗、统计、报告",
    eyebrow: "DATA",
    duration: "35–50 分钟",
    goal: "把列表、字典、循环、条件组合起来，完成小型数据报告。",
    analogy: "数据处理像整理一桌票据：先去掉空白和无效项，再分类统计，最后写成别人看得懂的报告。",
    explanation: [
      "数据处理不是神秘的大词。进阶阶段，你要练的是三步：清洗、统计、表达。",
      "清洗是把脏数据变整齐，比如去掉空格、跳过空值；统计是计算数量、总和、平均；表达是输出清楚的结果。",
      "这一步很适合和 Codex 配合：先让它解释思路，再让它帮你找边界情况。"
    ],
    keyPoints: ["清洗数据", "统计指标", "输出报告"],
    exampleCode: `raw_scores = [" 80", "", "95", "bad", "70"]
scores = []
for item in raw_scores:
    try:
        scores.append(int(item.strip()))
    except ValueError:
        pass
print(scores)
print(sum(scores) / len(scores))`,
    exercises: [
      ex("data1", "清洗名字", "names 中有空格和空字符串，清洗后只输出有效名字。", `names = [" 小林 ", "", "小周", "  "]`, "输出小林和小周。", `names = [" 小林 ", "", "小周", "  "]
clean_names = []
for name in names:
    clean = name.strip()
    if clean:
        clean_names.append(clean)
print(clean_names)`, both(["小林", "小周"], ["strip", "append"]), ["strip 去掉两边空格。", "空字符串在 if 中会被当作 False。"]),
      ex("data2", "生成成绩报告", "统计 records 中通过人数，并输出“通过2人”。", `records = [{"name": "A", "score": 80}, {"name": "B", "score": 50}, {"name": "C", "score": 90}]`, "输出通过2人。", `records = [{"name": "A", "score": 80}, {"name": "B", "score": 50}, {"name": "C", "score": 90}]
count = 0
for record in records:
    if record["score"] >= 60:
        count += 1
print(f"通过{count}人")`, both(["通过2人"], ["for", "if"]), ["每条 record 是字典。", "分数在 record['score']。"])
    ],
    codexTip: codexTip("小型数据处理")
  },
  {
    id: "mid-project",
    number: 8,
    title: "综合项目：学习记录分析器",
    eyebrow: "PROJECT",
    duration: "45–60 分钟",
    goal: "组合进阶知识，制作一个能记录、统计、输出报告的小程序。",
    analogy: "初级项目像一个能记任务的小本子；进阶项目像一个会帮你总结的小助教：它不仅保存记录，还能算趋势和给报告。",
    explanation: [
      "本项目使用列表里的字典保存学习记录，每条记录包含日期、主题和分钟数。",
      "你会写函数来添加记录、统计总时长、按主题汇总，并输出报告。",
      "这正是从“会写语法”走向“会做工具”的过渡。"
    ],
    keyPoints: ["列表字典建模", "函数拆分功能", "输出可读报告"],
    exampleCode: `records = []

def add_record(day, topic, minutes):
    records.append({"day": day, "topic": topic, "minutes": minutes})

def total_minutes():
    total = 0
    for record in records:
        total += record["minutes"]
    return total

add_record("周一", "字典", 30)
add_record("周二", "文件", 40)
print(f"总学习 {total_minutes()} 分钟")`,
    exercises: [
      ex("p1", "按主题统计", "给 records 写 topic_minutes(topic)，返回指定主题总时长。", `records = [
    {"topic": "字典", "minutes": 30},
    {"topic": "文件", "minutes": 40},
    {"topic": "字典", "minutes": 20}
]`, "调用字典主题，输出 50。", `records = [
    {"topic": "字典", "minutes": 30},
    {"topic": "文件", "minutes": 40},
    {"topic": "字典", "minutes": 20}
]

def topic_minutes(topic):
    total = 0
    for record in records:
        if record["topic"] == topic:
            total += record["minutes"]
    return total

print(topic_minutes("字典"))`, both(["50"], ["def", "return"]), ["函数参数 topic 是要查询的主题。", "循环里判断 record['topic'] 是否匹配。"]),
      ex("p2", "输出完整报告", "输出总记录数和总分钟数，格式包含“共2条记录”“总计70分钟”。", `records = [
    {"day": "周一", "topic": "字典", "minutes": 30},
    {"day": "周二", "topic": "文件", "minutes": 40}
]`, "输出记录数和总分钟数。", `records = [
    {"day": "周一", "topic": "字典", "minutes": 30},
    {"day": "周二", "topic": "文件", "minutes": 40}
]
total = 0
for record in records:
    total += record["minutes"]
print(f"共{len(records)}条记录")
print(f"总计{total}分钟")`, both(["共2条记录", "总计70分钟"], ["len", "for"]), ["记录数用 len(records)。", "总分钟数要循环累加。"])
    ],
    codexTip: codexTip("学习记录分析器项目")
  }
];
