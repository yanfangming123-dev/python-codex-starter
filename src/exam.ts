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
  validation: ValidationRule,
  hints: string[] = []
): Exercise {
  return {
    id: `final-${id}`,
    kind: "综合",
    title,
    task,
    starterCode,
    expected,
    answer,
    validation,
    hints: hints.length ? hints : [
      "先别急着写完整程序，把输入、处理、输出三件事分开。",
      "如果卡住，先用 print() 输出中间变量，看程序走到了哪一步。",
      "最后检查引号、冒号、缩进，以及列表索引是不是从 0 开始。"
    ]
  };
}

export const examExercises: Exercise[] = [
  task("01", "晨间清单", "建立 tasks 列表，包含“喝水”“阅读”“出门”。逐项输出，前面加上编号。", "", "输出 1. 喝水 到 3. 出门。", `tasks = ["喝水", "阅读", "出门"]
for index, task_name in enumerate(tasks, start=1):
    print(f"{index}. {task_name}")`, output("1. 喝水", "3. 出门")),
  task("02", "电影票价", "age=16。小于 12 输出儿童票，18 以下输出学生票，否则输出成人票。", "age = 16\n", "输出学生票。", `age = 16
if age < 12:
    print("儿童票")
elif age < 18:
    print("学生票")
else:
    print("成人票")`, output("学生票")),
  task("03", "零钱统计", "coins=[1,5,10,1,1]，用循环算出总金额。", "coins = [1, 5, 10, 1, 1]\n", "输出 18。", `coins = [1, 5, 10, 1, 1]
total = 0
for coin in coins:
    total += coin
print(total)`, both(["18"], ["for"])),
  task("04", "修理欢迎语", "修复代码，输出“欢迎小叶来到成都”。", `name = "小叶"
city = "成都"
print("欢迎" + name + "来到" + city`, "程序不报错并输出完整欢迎语。", `name = "小叶"
city = "成都"
print("欢迎" + name + "来到" + city)`, output("欢迎小叶来到成都")),
  task("05", "温度提醒", "temperatures=[18,24,31,27]，只输出 30 以上的温度，格式“高温：31”。", "temperatures = [18, 24, 31, 27]\n", "输出高温：31。", `temperatures = [18, 24, 31, 27]
for temperature in temperatures:
    if temperature > 30:
        print(f"高温：{temperature}")`, both(["高温：31"], ["for", "if"])),
  task("06", "姓名卡片", "定义 make_card(name, city)，返回“姓名：小林｜城市：杭州”。调用并输出。", "", "输出姓名和城市。", `def make_card(name, city):
    return f"姓名：{name}｜城市：{city}"

print(make_card("小林", "杭州"))`, both(["姓名：小林", "城市：杭州"], ["def", "return"])),
  task("07", "找最短词", "words=['python','ai','codex','web']，用循环找出最短的词。", "words = ['python', 'ai', 'codex', 'web']\n", "输出 ai。", `words = ["python", "ai", "codex", "web"]
shortest = words[0]
for word in words:
    if len(word) < len(shortest):
        shortest = word
print(shortest)`, both(["ai"], ["for", "if"])),
  task("08", "折扣小票", "price=80，count=2。总价满 100 减 20，输出“应付140”。", "price = 80\ncount = 2\n", "输出应付140。", `price = 80
count = 2
total = price * count
if total >= 100:
    total -= 20
print(f"应付{total}")`, output("应付140")),
  task("09", "修理列表展示", "修复索引错误，输出三个城市。", `cities = ["北京", "上海", "广州"]
for i in range(1, 4):
    print(cities[i])`, "输出北京、上海、广州且不报错。", `cities = ["北京", "上海", "广州"]
for i in range(3):
    print(cities[i])`, output("北京", "上海", "广州")),
  task("10", "每日步数", "steps=[3000,8000,12000,6000]，统计达到 8000 的天数。", "steps = [3000, 8000, 12000, 6000]\n", "输出达标2天。", `steps = [3000, 8000, 12000, 6000]
count = 0
for step in steps:
    if step >= 8000:
        count += 1
print(f"达标{count}天")`, both(["达标2天"], ["for", "if"])),
  task("11", "菜单编号", "foods=['面','饭','汤']，输出“第1项：面”到“第3项：汤”。", "foods = ['面', '饭', '汤']\n", "输出三行带编号菜单。", `foods = ["面", "饭", "汤"]
for number, food in enumerate(foods, start=1):
    print(f"第{number}项：{food}")`, output("第1项：面", "第3项：汤")),
  task("12", "考试评级", "定义 level(score)：90及以上A，70及以上B，否则C。调用 76。", "", "输出 B。", `def level(score):
    if score >= 90:
        return "A"
    elif score >= 70:
        return "B"
    return "C"

print(level(76))`, both(["B"], ["def", "return"])),
  task("13", "字符串拼接练习", "name='安安'，minutes=25，输出“安安今天学习25分钟”。", "name = '安安'\nminutes = 25\n", "输出完整句子。", `name = "安安"
minutes = 25
print(f"{name}今天学习{minutes}分钟")`, output("安安今天学习25分钟")),
  task("14", "偶数收集", "numbers=[1,2,3,4,5,6]，把偶数放进 evens 并输出。", "numbers = [1, 2, 3, 4, 5, 6]\nevens = []\n", "输出列表包含 2、4、6。", `numbers = [1, 2, 3, 4, 5, 6]
evens = []
for number in numbers:
    if number % 2 == 0:
        evens.append(number)
print(evens)`, both(["2", "4", "6"], ["append"])),
  task("15", "修理函数返回", "修复函数，让 print(double(6)) 输出 12。", `def double(number):
    number * 2

print(double(6))`, "输出 12。", `def double(number):
    return number * 2

print(double(6))`, both(["12"], ["return"])),
  task("16", "背单词进度", "words=['cat','dog','bird']，输出“已背3个单词”。", "words = ['cat', 'dog', 'bird']\n", "输出已背3个单词。", `words = ["cat", "dog", "bird"]
print(f"已背{len(words)}个单词")`, output("已背3个单词")),
  task("17", "倒计时", "用循环输出 5、4、3、2、1、开始。", "", "输出倒计时和开始。", `for number in range(5, 0, -1):
    print(number)
print("开始")`, both(["5", "1", "开始"], ["range"])),
  task("18", "合并问候", "names=['小王','小李','小陈']，逐个输出“你好，小王”。", "names = ['小王', '小李', '小陈']\n", "输出三句问候。", `names = ["小王", "小李", "小陈"]
for name in names:
    print(f"你好，{name}")`, output("你好，小王", "你好，小陈")),
  task("19", "修理条件", "修复代码，score=59 时输出“再练练”。", `score = 59
if score => 60:
    print("通过")
else:
    print("再练练")`, "输出再练练。", `score = 59
if score >= 60:
    print("通过")
else:
    print("再练练")`, output("再练练")),
  task("20", "总价函数", "定义 total_price(prices)，用循环返回总价。调用 [10,20,5]。", "", "输出 35。", `def total_price(prices):
    total = 0
    for price in prices:
        total += price
    return total

print(total_price([10, 20, 5]))`, both(["35"], ["def", "for", "return"])),
  task("21", "学习时长分类", "minutes=45。小于30输出短练习，小于60输出标准练习，否则长练习。", "minutes = 45\n", "输出标准练习。", `minutes = 45
if minutes < 30:
    print("短练习")
elif minutes < 60:
    print("标准练习")
else:
    print("长练习")`, output("标准练习")),
  task("22", "修改清单", "tasks=['读书','刷手机','睡觉']，把第二项改成“练代码”并输出列表。", "tasks = ['读书', '刷手机', '睡觉']\n", "输出中包含练代码。", `tasks = ["读书", "刷手机", "睡觉"]
tasks[1] = "练代码"
print(tasks)`, output("练代码")),
  task("23", "最大差值", "high=31，low=22，输出“温差9度”。", "high = 31\nlow = 22\n", "输出温差9度。", `high = 31
low = 22
difference = high - low
print(f"温差{difference}度")`, output("温差9度")),
  task("24", "名字长度报告", "names=['白露','司马青山','阿九']，输出每个名字和长度。", "names = ['白露', '司马青山', '阿九']\n", "输出司马青山：4。", `names = ["白露", "司马青山", "阿九"]
for name in names:
    print(f"{name}：{len(name)}")`, output("白露：2", "司马青山：4")),
  task("25", "任务完成数", "done=[True,False,True,True]，统计 True 的数量。", "done = [True, False, True, True]\n", "输出完成3项。", `done = [True, False, True, True]
count = 0
for item in done:
    if item:
        count += 1
print(f"完成{count}项")`, both(["完成3项"], ["for", "if"])),
  task("26", "修理缩进", "修复缩进，让程序输出两个数字后再输出完成。", `for number in range(2):
print(number)
print("完成")`, "输出 0、1，完成只输出一次。", `for number in range(2):
    print(number)
print("完成")`, output("0", "1", "完成")),
  task("27", "生成口令", "定义 make_code(word, number)，返回 word-number。调用 py 和 2026。", "", "输出 py-2026。", `def make_code(word, number):
    return f"{word}-{number}"

print(make_code("py", 2026))`, both(["py-2026"], ["def", "return"])),
  task("28", "累计奇数", "计算 1 到 9 中所有奇数的和。", "", "输出 25。", `total = 0
for number in range(1, 10):
    if number % 2 == 1:
        total += number
print(total)`, both(["25"], ["for", "if"])),
  task("29", "添加购物项", "cart=['牛奶']，依次添加“面包”“苹果”，再逐项输出。", "cart = ['牛奶']\n", "输出牛奶、面包、苹果。", `cart = ["牛奶"]
cart.append("面包")
cart.append("苹果")
for item in cart:
    print(item)`, both(["牛奶", "面包", "苹果"], ["append"])),
  task("30", "合格名单", "scores=[55,80,90,42]，输出所有合格分数。", "scores = [55, 80, 90, 42]\n", "输出 80 和 90。", `scores = [55, 80, 90, 42]
for score in scores:
    if score >= 60:
        print(score)`, output("80", "90")),
  task("31", "修理变量名", "修复变量名问题，输出“Python”。", `my topic = "Python"
print(my topic)`, "输出 Python。", `my_topic = "Python"
print(my_topic)`, output("Python")),
  task("32", "平均步数", "steps=[5000,7000,9000]，计算平均值并输出。", "steps = [5000, 7000, 9000]\n", "输出 7000。", `steps = [5000, 7000, 9000]
total = 0
for step in steps:
    total += step
average = total / len(steps)
print(average)`, both(["7000"], ["for"])),
  task("33", "标签函数", "定义 tag(text)，返回“【text】”。调用“重点”。", "", "输出【重点】。", `def tag(text):
    return f"【{text}】"

print(tag("重点"))`, both(["【重点】"], ["def", "return"])),
  task("34", "超过平均", "scores=[60,75,90]，先算平均分，再输出高于平均分的分数。", "scores = [60, 75, 90]\n", "输出 90。", `scores = [60, 75, 90]
total = 0
for score in scores:
    total += score
average = total / len(scores)
for score in scores:
    if score > average:
        print(score)`, both(["90"], ["for", "if"])),
  task("35", "修理 f-string", "修复代码，输出“库存：8件”。", `count = 8
print("库存：{count}件")`, "输出库存：8件。", `count = 8
print(f"库存：{count}件")`, output("库存：8件")),
  task("36", "周计划", "days=['周一','周二','周三']，输出“周一：练习Python”等三行。", "days = ['周一', '周二', '周三']\n", "输出三天计划。", `days = ["周一", "周二", "周三"]
for day in days:
    print(f"{day}：练习Python")`, output("周一：练习Python", "周三：练习Python")),
  task("37", "密码检查", "password='codex'。如果等于 codex 输出通过，否则拒绝。", "password = 'codex'\n", "输出通过。", `password = "codex"
if password == "codex":
    print("通过")
else:
    print("拒绝")`, both(["通过"], ["=="])),
  task("38", "分数摘要", "定义 report(name, score)，返回“小明：88分”。调用小明和88。", "", "输出小明：88分。", `def report(name, score):
    return f"{name}：{score}分"

print(report("小明", 88))`, both(["小明：88分"], ["def", "return"])),
  task("39", "清单是否为空", "tasks=[]。如果为空输出“暂无任务”，否则输出“有任务”。", "tasks = []\n", "输出暂无任务。", `tasks = []
if len(tasks) == 0:
    print("暂无任务")
else:
    print("有任务")`, output("暂无任务")),
  task("40", "两倍列表", "numbers=[2,4,6]，逐项输出它们的两倍。", "numbers = [2, 4, 6]\n", "输出 4、8、12。", `numbers = [2, 4, 6]
for number in numbers:
    print(number * 2)`, output("4", "8", "12")),
  task("41", "修理调用", "修复函数调用，输出“早上好，小夏”。", `def greet(time, name):
    print(f"{time}好，{name}")

greet("小夏")`, "输出早上好，小夏。", `def greet(time, name):
    print(f"{time}好，{name}")

greet("早上", "小夏")`, output("早上好，小夏")),
  task("42", "找最后一项", "items=['铅笔','本子','橡皮']，输出最后一项。", "items = ['铅笔', '本子', '橡皮']\n", "输出橡皮。", `items = ["铅笔", "本子", "橡皮"]
print(items[-1])`, output("橡皮")),
  task("43", "乘法小表", "用循环输出 3×1=3 到 3×4=12。", "", "输出四条乘法式。", `for number in range(1, 5):
    print(f"3×{number}={3 * number}")`, output("3×1=3", "3×4=12")),
  task("44", "低库存提醒", "stocks=[5,0,2,10]，输出所有小于 3 的库存。", "stocks = [5, 0, 2, 10]\n", "输出 0 和 2。", `stocks = [5, 0, 2, 10]
for stock in stocks:
    if stock < 3:
        print(stock)`, output("0", "2")),
  task("45", "修理总和", "修复代码，让它输出 6。", `numbers = [1, 2, 3]
total = 0
for number in numbers:
total = total + number
print(total)`, "输出 6。", `numbers = [1, 2, 3]
total = 0
for number in numbers:
    total = total + number
print(total)`, output("6")),
  task("46", "生成任务行", "定义 task_line(number, title, done)。done 为 True 用 ✓，否则用 □。调用 2, '练习', False。", "", "输出 2. □ 练习。", `def task_line(number, title, done):
    mark = "✓" if done else "□"
    return f"{number}. {mark} {title}"

print(task_line(2, "练习", False))`, both(["2. □ 练习"], ["def", "return"])),
  task("47", "统计长句", "sentences=['hi','hello','good morning']，输出长度大于 5 的句子。", "sentences = ['hi', 'hello', 'good morning']\n", "输出 good morning。", `sentences = ["hi", "hello", "good morning"]
for sentence in sentences:
    if len(sentence) > 5:
        print(sentence)`, output("good morning")),
  task("48", "学习积分", "days=4，每天 10 分，额外奖励 5 分，输出总积分45。", "days = 4\n", "输出总积分45。", `days = 4
points = days * 10 + 5
print(f"总积分{points}")`, output("总积分45")),
  task("49", "首字母清单", "words=['apple','banana','cat']，输出每个词的第一个字母。", "words = ['apple', 'banana', 'cat']\n", "输出 a、b、c。", `words = ["apple", "banana", "cat"]
for word in words:
    print(word[0])`, output("a", "b", "c")),
  task("50", "修理布尔值", "修复代码，is_open 为 True 时输出营业中。", `is_open = true
if is_open:
    print("营业中")`, "输出营业中。", `is_open = True
if is_open:
    print("营业中")`, output("营业中")),
  task("51", "三次尝试", "用循环输出“第1次尝试”“第2次尝试”“第3次尝试”。", "", "输出三次尝试。", `for number in range(1, 4):
    print(f"第{number}次尝试")`, output("第1次尝试", "第3次尝试")),
  task("52", "列表首尾", "letters=['A','B','C','D']，输出第一项和最后一项。", "letters = ['A', 'B', 'C', 'D']\n", "输出 A 和 D。", `letters = ["A", "B", "C", "D"]
print(letters[0])
print(letters[-1])`, output("A", "D")),
  task("53", "通过率", "scores=[80,40,70,90]，统计及格人数并输出“通过率75.0%”。", "scores = [80, 40, 70, 90]\n", "输出通过率75.0%。", `scores = [80, 40, 70, 90]
passed = 0
for score in scores:
    if score >= 60:
        passed += 1
rate = passed / len(scores) * 100
print(f"通过率{rate}%")`, both(["通过率75"], ["for", "if"])),
  task("54", "问候工厂", "定义 greet_all(names)，逐项输出“你好，名字”。调用两个名字。", "", "输出两句问候。", `def greet_all(names):
    for name in names:
        print(f"你好，{name}")

greet_all(["阿青", "阿白"])`, both(["你好，阿青", "你好，阿白"], ["def", "for"])),
  task("55", "修理列表添加", "修复代码，把“完成”加入列表并输出。", `status = ["开始"]
status.add("完成")
print(status)`, "输出中包含完成。", `status = ["开始"]
status.append("完成")
print(status)`, both(["完成"], ["append"])),
  task("56", "奇偶标签", "number=8，输出“8是偶数”。", "number = 8\n", "输出 8是偶数。", `number = 8
if number % 2 == 0:
    print(f"{number}是偶数")
else:
    print(f"{number}是奇数")`, both(["8是偶数"], ["%"])),
  task("57", "任务摘要函数", "定义 summary(tasks)，返回“共2项：阅读、练习”。", "tasks = ['阅读', '练习']\n", "输出共2项：阅读、练习。", `tasks = ["阅读", "练习"]

def summary(tasks):
    return f"共{len(tasks)}项：{tasks[0]}、{tasks[1]}"

print(summary(tasks))`, both(["共2项：阅读、练习"], ["def", "return"])),
  task("58", "寻找目标", "items=['书','笔','杯子']。如果找到“笔”输出“找到了”。", "items = ['书', '笔', '杯子']\n", "输出找到了。", `items = ["书", "笔", "杯子"]
found = False
for item in items:
    if item == "笔":
        found = True
if found:
    print("找到了")`, both(["找到了"], ["for", "if"])),
  task("59", "完成比例", "done=3，total=5，输出“完成60.0%”。", "done = 3\ntotal = 5\n", "输出完成60.0%。", `done = 3
total = 5
percent = done / total * 100
print(f"完成{percent}%")`, output("完成60")),
  task("60", "迷你任务助手", "建立 tasks 空列表，定义 add_task 和 show_tasks，添加“复盘”“预习”并显示编号。", "", "输出两项带编号任务，并使用函数和列表。", `tasks = []

def add_task(title):
    tasks.append(title)

def show_tasks():
    for number, title in enumerate(tasks, start=1):
        print(f"{number}. □ {title}")

add_task("复盘")
add_task("预习")
show_tasks()`, both(["1. □ 复盘", "2. □ 预习"], ["def", "append", "for"]))
];

export const examExerciseCount = examExercises.length;
