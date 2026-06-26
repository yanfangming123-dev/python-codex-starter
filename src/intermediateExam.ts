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
print(report())`, both(["总计70分钟"], ["def", "append", "return"])),
  task("33", "购物清单合计", "items 中有 price 和 count，输出总价 26。", `items = [{"name": "笔", "price": 3, "count": 2}, {"name": "本", "price": 10, "count": 2}]`, "输出26。", `items = [{"name": "笔", "price": 3, "count": 2}, {"name": "本", "price": 10, "count": 2}]
total = 0
for item in items:
    total += item["price"] * item["count"]
print(total)`, both(["26"], ["for", "*"])),
  task("34", "缺失城市补全", "users 中有些没有 city，输出 name-city，缺失用未知。", `users = [{"name": "A", "city": "上海"}, {"name": "B"}]`, "输出A-上海和B-未知。", `users = [{"name": "A", "city": "上海"}, {"name": "B"}]
for user in users:
    print(f"{user['name']}-{user.get('city', '未知')}")`, both(["A-上海", "B-未知"], ["get"])),
  task("35", "任务标题文本", "把 tasks 的 title 连接成用逗号分隔的文本。", `tasks = [{"title": "阅读"}, {"title": "练习"}, {"title": "复盘"}]`, "输出阅读,练习,复盘。", `tasks = [{"title": "阅读"}, {"title": "练习"}, {"title": "复盘"}]
titles = [task["title"] for task in tasks]
print(",".join(titles))`, both(["阅读,练习,复盘"], ["join"])),
  task("36", "安全整数求和", "raw 中混有空格、空项和坏数据，只累加有效数字。", `raw = [" 5", "", "x", "15"]`, "输出20。", `raw = [" 5", "", "x", "15"]
total = 0
for item in raw:
    try:
        total += int(item.strip())
    except ValueError:
        pass
print(total)`, both(["20"], ["try", "strip"])),
  task("37", "按完成状态分组", "统计 tasks 中 done 和 todo 的数量。", `tasks = [{"done": True}, {"done": False}, {"done": True}, {"done": False}]`, "输出done=2和todo=2。", `tasks = [{"done": True}, {"done": False}, {"done": True}, {"done": False}]
done = 0
todo = 0
for task in tasks:
    if task["done"]:
        done += 1
    else:
        todo += 1
print(f"done={done}")
print(f"todo={todo}")`, both(["done=2", "todo=2"], ["else"])),
  task("38", "最长标题", "输出 tasks 中标题最长的一项。", `tasks = [{"title": "读"}, {"title": "练Python"}, {"title": "复盘"}]`, "输出练Python。", `tasks = [{"title": "读"}, {"title": "练Python"}, {"title": "复盘"}]
longest = tasks[0]
for task in tasks:
    if len(task["title"]) > len(longest["title"]):
        longest = task
print(longest["title"])`, both(["练Python"], ["len"])),
  task("39", "记录转多行报告", "把 records 转成“周一：字典 30分钟”这样的多行文本。", `records = [{"day": "周一", "topic": "字典", "minutes": 30}, {"day": "周二", "topic": "文件", "minutes": 40}]`, "输出两行报告。", `records = [{"day": "周一", "topic": "字典", "minutes": 30}, {"day": "周二", "topic": "文件", "minutes": 40}]
lines = []
for record in records:
    lines.append(f"{record['day']}：{record['topic']} {record['minutes']}分钟")
print("\\n".join(lines))`, both(["周一：字典 30分钟", "周二：文件 40分钟"], ["join"])),
  task("40", "CSV 文本清洗", "从多行 CSV 文本中统计 minutes 总和。", `text = "周一,字典,30\\n周二,文件,40\\n坏行"`, "输出70。", `text = "周一,字典,30\\n周二,文件,40\\n坏行"
total = 0
for line in text.split("\\n"):
    try:
        day, topic, minutes = line.split(",")
        total += int(minutes)
    except ValueError:
        pass
print(total)`, both(["70"], ["split", "try"])),
  task("41", "分数等级报告", "students 中 score>=90 为优秀，否则为继续练习。", `students = [{"name": "A", "score": 95}, {"name": "B", "score": 70}]`, "输出A：优秀和B：继续练习。", `students = [{"name": "A", "score": 95}, {"name": "B", "score": 70}]
for student in students:
    level = "优秀" if student["score"] >= 90 else "继续练习"
    print(f"{student['name']}：{level}")`, both(["A：优秀", "B：继续练习"], ["if"])),
  task("42", "主题去重", "从 records 中输出不重复主题列表。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}, {"topic": "异常"}]`, "输出字典、文件、异常。", `records = [{"topic": "字典"}, {"topic": "文件"}, {"topic": "字典"}, {"topic": "异常"}]
topics = []
for record in records:
    if record["topic"] not in topics:
        topics.append(record["topic"])
print(topics)`, both(["字典", "文件", "异常"], ["not in"])),
  task("43", "函数化筛选", "定义 filter_done(tasks)，返回已完成任务。", `tasks = [{"title": "A", "done": True}, {"title": "B", "done": False}]`, "输出A。", `tasks = [{"title": "A", "done": True}, {"title": "B", "done": False}]
def filter_done(tasks):
    result = []
    for task in tasks:
        if task["done"]:
            result.append(task)
    return result
print(filter_done(tasks))`, both(["A"], ["def", "return"])),
  task("44", "函数化安全转换", "定义 to_int(text)，失败时返回 None。", "", "输出12和None。", `def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None
print(to_int("12"))
print(to_int("x"))`, both(["12", "None"], ["try", "return"])),
  task("45", "按主题平均", "计算 topic 为 字典 的平均分钟数。", `records = [{"topic": "字典", "minutes": 20}, {"topic": "文件", "minutes": 50}, {"topic": "字典", "minutes": 40}]`, "输出30。", `records = [{"topic": "字典", "minutes": 20}, {"topic": "文件", "minutes": 50}, {"topic": "字典", "minutes": 40}]
minutes = []
for record in records:
    if record["topic"] == "字典":
        minutes.append(record["minutes"])
print(sum(minutes) / len(minutes))`, both(["30"], ["sum", "len"])),
  task("46", "复习卡片", "用 enumerate 把 topics 输出为“第1题：字典”。", `topics = ["字典", "异常", "文件"]`, "输出第1题：字典和第3题：文件。", `topics = ["字典", "异常", "文件"]
for index, topic in enumerate(topics, start=1):
    print(f"第{index}题：{topic}")`, both(["第1题：字典", "第3题：文件"], ["enumerate"])),
  task("47", "库存预警", "items 中 count 小于 5 的输出“名称需要补货”。", `items = [{"name": "笔", "count": 3}, {"name": "本", "count": 10}]`, "输出笔需要补货。", `items = [{"name": "笔", "count": 3}, {"name": "本", "count": 10}]
for item in items:
    if item["count"] < 5:
        print(f"{item['name']}需要补货")`, both(["笔需要补货"], ["if"])),
  task("48", "随机但可复现", "固定 seed=2，从 actions 中抽一个动作并输出。", `actions = ["阅读", "练习", "复盘"]`, "输出阅读。", `import random
actions = ["阅读", "练习", "复盘"]
random.seed(2)
print(random.choice(actions))`, both(["阅读"], ["random.seed", "random.choice"])),
  task("49", "向上取整分页", "每页 10 条，items=23，计算需要几页。", `items = 23`, "输出3。", `import math
items = 23
pages = math.ceil(items / 10)
print(pages)`, both(["3"], ["math.ceil"])),
  task("50", "日期学习日志", "使用 date.today() 输出“学习日期：日期”。", "", "输出学习日期：。", `from datetime import date
print(f"学习日期：{date.today()}")`, both(["学习日期："], ["date.today"])),
  task("51", "嵌套统计字典", "把 records 按 topic 汇总为字典并输出。", `records = [{"topic": "字典", "minutes": 20}, {"topic": "文件", "minutes": 10}, {"topic": "字典", "minutes": 30}]`, "输出字典50和文件10。", `records = [{"topic": "字典", "minutes": 20}, {"topic": "文件", "minutes": 10}, {"topic": "字典", "minutes": 30}]
summary = {}
for record in records:
    topic = record["topic"]
    summary[topic] = summary.get(topic, 0) + record["minutes"]
print(summary)`, both(["字典", "50", "文件", "10"], ["get"])),
  task("52", "生成学习建议", "如果总分钟数小于 60 输出继续加练，否则输出达标。", `records = [{"minutes": 20}, {"minutes": 30}]`, "输出继续加练。", `records = [{"minutes": 20}, {"minutes": 30}]
total = 0
for record in records:
    total += record["minutes"]
if total < 60:
    print("继续加练")
else:
    print("达标")`, both(["继续加练"], ["if", "else"])),
  task("53", "清洗姓名并编号", "清洗 names 后输出编号列表。", `names = [" 小林 ", "", "小周"]`, "输出1. 小林和2. 小周。", `names = [" 小林 ", "", "小周"]
clean = [name.strip() for name in names if name.strip()]
for index, name in enumerate(clean, start=1):
    print(f"{index}. {name}")`, both(["1. 小林", "2. 小周"], ["strip", "enumerate"])),
  task("54", "安全读取嵌套列表", "尝试输出第二个学生姓名，缺失时输出没有第二人。", `students = [{"name": "A"}]`, "输出没有第二人。", `students = [{"name": "A"}]
try:
    print(students[1]["name"])
except IndexError:
    print("没有第二人")`, both(["没有第二人"], ["IndexError"])),
  task("55", "记录添加与查看", "定义 add_task 和 list_tasks，添加两条后逐行输出标题。", "", "输出阅读和练习。", `tasks = []
def add_task(title):
    tasks.append({"title": title, "done": False})
def list_tasks():
    for task in tasks:
        print(task["title"])
add_task("阅读")
add_task("练习")
list_tasks()`, both(["阅读", "练习"], ["def", "append"])),
  task("56", "完成任务报告", "定义 complete(title)，把匹配标题的任务设为完成。", `tasks = [{"title": "阅读", "done": False}, {"title": "练习", "done": False}]`, "输出阅读 True。", `tasks = [{"title": "阅读", "done": False}, {"title": "练习", "done": False}]
def complete(title):
    for task in tasks:
        if task["title"] == title:
            task["done"] = True
complete("阅读")
print(tasks[0]["title"], tasks[0]["done"])`, both(["阅读 True"], ["def", "if"])),
  task("57", "文本生成任务列表", "从多行文本生成 tasks 列表，每行是一个 title。", `text = "阅读\\n练习\\n复盘"`, "输出包含三条任务。", `text = "阅读\\n练习\\n复盘"
tasks = []
for line in text.split("\\n"):
    tasks.append({"title": line, "done": False})
print(tasks)`, both(["阅读", "练习", "复盘"], ["append"])),
  task("58", "任务导出文本", "把 tasks 导出为 ✓/□ 多行文本。", `tasks = [{"title": "阅读", "done": True}, {"title": "练习", "done": False}]`, "输出✓ 阅读和□ 练习。", `tasks = [{"title": "阅读", "done": True}, {"title": "练习", "done": False}]
lines = []
for task in tasks:
    mark = "✓" if task["done"] else "□"
    lines.append(f"{mark} {task['title']}")
print("\\n".join(lines))`, both(["✓ 阅读", "□ 练习"], ["join"])),
  task("59", "学习分析函数组", "定义 total_minutes 和 best_topic，输出总计90和最高主题文件。", `records = [{"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 60}]`, "输出总计90和最高文件。", `records = [{"topic": "字典", "minutes": 30}, {"topic": "文件", "minutes": 60}]
def total_minutes(records):
    total = 0
    for record in records:
        total += record["minutes"]
    return total
def best_topic(records):
    best = records[0]
    for record in records:
        if record["minutes"] > best["minutes"]:
            best = record
    return best["topic"]
print(f"总计{total_minutes(records)}")
print(f"最高{best_topic(records)}")`, both(["总计90", "最高文件"], ["def", "return"])),
  task("60", "进阶毕业小项目", "做一个内存版学习日志：添加记录、按主题统计、输出报告。", "", "输出字典50和总计90。", `records = []
def add_record(topic, minutes):
    records.append({"topic": topic, "minutes": minutes})
def total_by_topic(topic):
    total = 0
    for record in records:
        if record["topic"] == topic:
            total += record["minutes"]
    return total
def report():
    total = 0
    for record in records:
        total += record["minutes"]
    return f"字典{total_by_topic('字典')}，总计{total}"
add_record("字典", 20)
add_record("文件", 40)
add_record("字典", 30)
print(report())`, both(["字典50", "总计90"], ["def", "append", "return"]))
];

export const intermediateExamExerciseCount = intermediateExamExercises.length;
