import type { Exercise, ValidationRule, WorkbookUnit } from "./types";

const output = (...values: string[]): ValidationRule => ({ type: "outputIncludes", values });
const code = (...values: string[]): ValidationRule => ({ type: "codeIncludes", values });
const both = (out: string[], source: string[]): ValidationRule => ({ type: "both", output: out, code: source });

function ex(
  id: string,
  kind: Exercise["kind"],
  title: string,
  task: string,
  starterCode: string,
  expected: string,
  answer: string,
  validation: ValidationRule,
  hints: string[] = []
): Exercise {
  return {
    id: `wb-${id}`, kind, title, task, starterCode, expected, answer, validation,
    hints: hints.length ? hints : ["先把目标拆成一条最小指令。", "对照本单元学过的写法，检查括号、引号、冒号和缩进。"]
  };
}

export const workbookUnits: WorkbookUnit[] = [
  {
    id: "wb-print", number: 1, title: "输出与代码顺序", subtitle: "把最基本的指令写稳",
    focus: ["print()", "引号与括号", "从上到下执行"],
    exercises: [
      ex("p1", "模仿", "输出一句话", "让程序输出：今天开始练习 Python", 'print("请修改")', "输出指定句子。", 'print("今天开始练习 Python")', output("今天开始练习 Python")),
      ex("p2", "补全", "补上第二行", "第一行已有内容，补写第二行输出“第二步：运行”。", 'print("第一步：写代码")\n# 补在这里', "依次输出第一步和第二步。", 'print("第一步：写代码")\nprint("第二步：运行")', output("第一步：写代码", "第二步：运行")),
      ex("p3", "改错", "修好缺失的引号", "修复代码，让它输出“保持好奇”。", 'print(保持好奇)', "程序不报错并输出保持好奇。", 'print("保持好奇")', output("保持好奇"), ["文字必须放在哪里？", "使用英文双引号包住文字。"]),
      ex("p4", "改错", "修好括号", "修复两处括号问题。", 'print("开始"\nprint"完成")', "依次输出开始、完成。", 'print("开始")\nprint("完成")', output("开始", "完成")),
      ex("p5", "独立", "三行学习计划", "从空白开始，分别输出“阅读”“练习”“复盘”，每项一行。", "", "输出三行指定内容。", 'print("阅读")\nprint("练习")\nprint("复盘")', output("阅读", "练习", "复盘")),
      ex("p6", "补全", "观察执行顺序", "补全中间一行，使输出顺序为 A、B、C。", 'print("A")\n# 补全\nprint("C")', "按顺序输出 A B C。", 'print("A")\nprint("B")\nprint("C")', output("A", "B", "C")),
      ex("p7", "改错", "辨认注释", "当前第二行没有运行。修改它，让“我会运行”真正显示出来。", 'print("第一行")\n# print("我会运行")', "输出两行文字。", 'print("第一行")\nprint("我会运行")', output("第一行", "我会运行")),
      ex("p8", "综合", "制作迷你名片", "输出姓名、城市和一句自我介绍，共三行。内容可自定，但必须出现“姓名”“城市”“我正在学 Python”。", "", "输出包含三个指定信息的名片。", 'print("姓名：小夏")\nprint("城市：上海")\nprint("我正在学 Python")', output("姓名", "城市", "我正在学 Python"))
    ]
  },
  {
    id: "wb-variables", number: 2, title: "变量与数据类型", subtitle: "把信息放进正确的盒子",
    focus: ["变量赋值", "str / int / float / bool", "读取变量"],
    exercises: [
      ex("v1", "模仿", "保存姓名", "创建 name 变量保存“小林”，然后输出它。", '# 写变量\n', "输出小林。", 'name = "小林"\nprint(name)', both(["小林"], ["name", "="])),
      ex("v2", "补全", "保存年龄", "补全 age 的值并输出。", 'age = # 填写数字\nprint(age)', "输出 20。", 'age = 20\nprint(age)', output("20")),
      ex("v3", "改错", "变量不是文字", "修复代码，让它输出变量中保存的上海，而不是单词 city。", 'city = "上海"\nprint("city")', "输出上海。", 'city = "上海"\nprint(city)', output("上海"), ["输出变量时，变量名外面不加引号。"]),
      ex("v4", "独立", "建立学习档案", "创建 topic、days、is_beginner 三个变量，分别保存“Python”、7、True 并输出。", "", "输出 Python、7、True。", 'topic = "Python"\ndays = 7\nis_beginner = True\nprint(topic)\nprint(days)\nprint(is_beginner)', output("Python", "7", "True")),
      ex("v5", "补全", "重新赋值", "让 score 先是 60，后来变成 80，最后输出 80。", 'score = 60\n# 重新赋值\nprint(score)', "最终输出 80。", 'score = 60\nscore = 80\nprint(score)', output("80")),
      ex("v6", "改错", "变量名不能有空格", "修复变量名并正常输出。", 'user name = "阿宁"\nprint(user name)', "输出阿宁。", 'user_name = "阿宁"\nprint(user_name)', output("阿宁")),
      ex("v7", "独立", "检查四种类型", "用 type() 分别查看“hello”、10、3.5、False。", "", "输出中出现 str、int、float、bool。", 'print(type("hello"))\nprint(type(10))\nprint(type(3.5))\nprint(type(False))', output("str", "int", "float", "bool")),
      ex("v8", "综合", "交换两个盒子", "已有 a=1、b=2，使用临时变量 temp 交换它们，最后输出 2 和 1。", 'a = 1\nb = 2\n# 使用 temp 完成交换\n\nprint(a)\nprint(b)', "依次输出 2、1，并使用 temp。", 'a = 1\nb = 2\ntemp = a\na = b\nb = temp\nprint(a)\nprint(b)', both(["2", "1"], ["temp"]))
    ]
  },
  {
    id: "wb-operations", number: 3, title: "字符串与数字运算", subtitle: "让变量参与计算和表达",
    focus: ["四则运算", "字符串拼接", "f-string"],
    exercises: [
      ex("o1", "模仿", "计算加法", "计算 12 + 8 并输出。", 'result = 12 + 8\n# 输出 result', "输出 20。", 'result = 12 + 8\nprint(result)', output("20")),
      ex("o2", "补全", "计算面积", "长为 6、宽为 4，计算 area。", 'length = 6\nwidth = 4\narea = # 补全\nprint(area)', "输出 24。", 'length = 6\nwidth = 4\narea = length * width\nprint(area)', output("24")),
      ex("o3", "改错", "数字与文字不能直接相加", "修复代码，输出“我今年18岁”。", 'age = 18\nprint("我今年" + age + "岁")', "输出完整年龄句子。", 'age = 18\nprint(f"我今年{age}岁")', output("我今年18岁"), ["可以使用 f-string 避免类型冲突。"]),
      ex("o4", "独立", "计算平均数", "计算 80、90、100 的平均数并输出。", "", "输出 90.0 或 90。", 'average = (80 + 90 + 100) / 3\nprint(average)', output("90")),
      ex("o5", "补全", "生成欢迎语", "用 f-string 补全欢迎语。", 'name = "小周"\ncity = "杭州"\nprint(f"欢迎{# 补全}")', "输出“欢迎小周来到杭州”。", 'name = "小周"\ncity = "杭州"\nprint(f"欢迎{name}来到{city}")', output("欢迎小周来到杭州")),
      ex("o6", "改错", "注意运算顺序", "修改表达式，让结果为 20，而不是 14。", 'result = 2 + 3 * 4\nprint(result)', "输出 20。", 'result = (2 + 3) * 4\nprint(result)', output("20")),
      ex("o7", "独立", "分钟换算", "把 135 分钟换算成 2 小时 15 分钟并输出完整句子。", "", "输出中包含 2 小时和 15 分钟。", 'minutes = 135\nhours = minutes // 60\nleft = minutes % 60\nprint(f"{hours}小时{left}分钟")', output("2小时15分钟")),
      ex("o8", "综合", "购物小票", "单价 12.5 元，数量 4，优惠 5 元，计算并输出“应付45.0元”。", "", "输出应付金额 45。", 'price = 12.5\ncount = 4\ndiscount = 5\ntotal = price * count - discount\nprint(f"应付{total}元")', output("应付45"))
    ]
  },
  {
    id: "wb-conditions", number: 4, title: "条件判断", subtitle: "把每一条岔路走明白",
    focus: ["比较运算", "if / elif / else", "缩进"],
    exercises: [
      ex("c1", "模仿", "判断正数", "当 number 大于 0 时输出“正数”。", 'number = 5\n# 写 if', "输出正数。", 'number = 5\nif number > 0:\n    print("正数")', both(["正数"], ["if", ">"])),
      ex("c2", "补全", "成年判断", "补全 else 分支。", 'age = 15\nif age >= 18:\n    print("成年")\nelse:\n    # 补全', "输出未成年。", 'age = 15\nif age >= 18:\n    print("成年")\nelse:\n    print("未成年")', output("未成年")),
      ex("c3", "改错", "相等需要两个等号", "修复条件，密码正确时输出“通过”。", 'password = "python"\nif password = "python":\n    print("通过")', "输出通过。", 'password = "python"\nif password == "python":\n    print("通过")', both(["通过"], ["=="])),
      ex("c4", "改错", "修复缩进", "修复代码，使天气为 rain 时输出带伞。", 'weather = "rain"\nif weather == "rain":\nprint("带伞")', "输出带伞。", 'weather = "rain"\nif weather == "rain":\n    print("带伞")', output("带伞")),
      ex("c5", "独立", "判断奇偶", "number=7，如果能被 2 整除输出偶数，否则输出奇数。", 'number = 7\n', "输出奇数。", 'number = 7\nif number % 2 == 0:\n    print("偶数")\nelse:\n    print("奇数")', both(["奇数"], ["%", "else"])),
      ex("c6", "独立", "三档温度", "temperature=28：大于等于30输出炎热，大于等于20输出舒适，否则输出凉爽。", 'temperature = 28\n', "输出舒适，并使用 elif。", 'temperature = 28\nif temperature >= 30:\n    print("炎热")\nelif temperature >= 20:\n    print("舒适")\nelse:\n    print("凉爽")', both(["舒适"], ["elif", "else"])),
      ex("c7", "改错", "条件顺序很重要", "代码把 95 分判断为及格。调整顺序，让它输出优秀。", 'score = 95\nif score >= 60:\n    print("及格")\nelif score >= 90:\n    print("优秀")', "输出优秀。", 'score = 95\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("及格")', output("优秀")),
      ex("c8", "综合", "简易票价", "age=65：小于12票价10，60及以上票价15，其他票价20。输出当前票价。", 'age = 65\n', "输出票价15。", 'age = 65\nif age < 12:\n    price = 10\nelif age >= 60:\n    price = 15\nelse:\n    price = 20\nprint(f"票价{price}")', output("票价15"))
    ]
  },
  {
    id: "wb-loops", number: 5, title: "循环强化训练", subtitle: "先看懂每一轮，再写循环",
    focus: ["range()", "计数变量", "累计与筛选"],
    exercises: [
      ex("l1", "模仿", "重复三次", "用 for 循环输出三次“练习”。", '# 写循环', "输出三次练习。", 'for i in range(3):\n    print("练习")', both(["练习"], ["for", "range"])),
      ex("l2", "补全", "从 1 数到 5", "补全 range。", 'for number in range(# 补全):\n    print(number)', "依次输出 1 到 5。", 'for number in range(1, 6):\n    print(number)', both(["1", "2", "3", "4", "5"], ["range"])),
      ex("l3", "改错", "结尾数字不包含", "修复代码，让它包含数字 5。", 'for number in range(1, 5):\n    print(number)', "输出中包含 5。", 'for number in range(1, 6):\n    print(number)', output("5"), ["range 的第二个数字不会被包含。"]),
      ex("l4", "补全", "观察每一轮", "在循环中输出“第1轮”到“第4轮”。", 'for i in range(1, 5):\n    # 补全', "输出第1轮和第4轮等内容。", 'for i in range(1, 5):\n    print(f"第{i}轮")', output("第1轮", "第4轮")),
      ex("l5", "改错", "缩进决定重复内容", "让“完成”只在循环结束后输出一次。", 'for i in range(3):\n    print(i)\n    print("完成")', "输出 0、1、2，完成只出现一次。", 'for i in range(3):\n    print(i)\nprint("完成")', both(["0", "1", "2", "完成"], ["print(\"完成\")"])),
      ex("l6", "独立", "输出偶数", "用循环输出 2、4、6、8、10。", "", "依次输出五个偶数。", 'for number in range(2, 11, 2):\n    print(number)', both(["2", "4", "6", "8", "10"], ["range"])),
      ex("l7", "补全", "累计 1 到 10", "补全累计语句。", 'total = 0\nfor number in range(1, 11):\n    # 累加\nprint(total)', "输出 55。", 'total = 0\nfor number in range(1, 11):\n    total = total + number\nprint(total)', output("55")),
      ex("l8", "独立", "计算乘积", "用循环计算 1×2×3×4×5。", 'result = 1\n', "输出 120。", 'result = 1\nfor number in range(1, 6):\n    result = result * number\nprint(result)', output("120")),
      ex("l9", "独立", "循环中的条件", "遍历 1 到 10，只输出大于 7 的数字。", "", "输出 8、9、10。", 'for number in range(1, 11):\n    if number > 7:\n        print(number)', both(["8", "9", "10"], ["for", "if"])),
      ex("l10", "综合", "制作乘法表的一行", "用循环输出 7×1=7 到 7×5=35。", "", "输出五条 7 的乘法算式。", 'for number in range(1, 6):\n    print(f"7×{number}={7 * number}")', output("7×1=7", "7×5=35"))
    ]
  },
  {
    id: "wb-lists", number: 6, title: "列表强化训练", subtitle: "把一组数据拿稳、改对、遍历清楚",
    focus: ["索引", "append() / 修改", "列表与循环"],
    exercises: [
      ex("a1", "模仿", "创建列表", "创建包含红、黄、蓝的 colors 并输出。", "", "输出列表中的三种颜色。", 'colors = ["红", "黄", "蓝"]\nprint(colors)', output("红", "黄", "蓝")),
      ex("a2", "补全", "读取第一项", "补全索引，输出苹果。", 'fruits = ["苹果", "香蕉", "橙子"]\nprint(fruits[# 补全])', "输出苹果。", 'fruits = ["苹果", "香蕉", "橙子"]\nprint(fruits[0])', output("苹果")),
      ex("a3", "改错", "索引从 0 开始", "修复代码，输出第三项橙子。", 'fruits = ["苹果", "香蕉", "橙子"]\nprint(fruits[3])', "输出橙子且不报错。", 'fruits = ["苹果", "香蕉", "橙子"]\nprint(fruits[2])', output("橙子")),
      ex("a4", "补全", "添加新任务", "使用 append 添加“复盘”。", 'tasks = ["阅读", "练习"]\n# 添加复盘\nprint(tasks)', "输出中包含复盘。", 'tasks = ["阅读", "练习"]\ntasks.append("复盘")\nprint(tasks)', both(["复盘"], ["append"])),
      ex("a5", "改错", "修改列表项目", "把第二项“散步”改成“跑步”。", 'activities = ["阅读", "散步", "休息"]\n# 修改第二项\nprint(activities)', "输出中包含跑步。", 'activities = ["阅读", "散步", "休息"]\nactivities[1] = "跑步"\nprint(activities)', output("跑步")),
      ex("a6", "独立", "逐项输出", "使用循环逐项输出 tools 中的内容。", 'tools = ["Python", "Thonny", "Codex"]\n', "输出三个工具，并使用 for。", 'tools = ["Python", "Thonny", "Codex"]\nfor tool in tools:\n    print(tool)', both(["Python", "Thonny", "Codex"], ["for"])),
      ex("a7", "补全", "编号清单", "用 enumerate 从 1 开始给任务编号。", 'tasks = ["阅读", "练习", "复盘"]\nfor number, task in enumerate(tasks, # 补全):\n    print(f"{number}. {task}")', "输出 1. 阅读 到 3. 复盘。", 'tasks = ["阅读", "练习", "复盘"]\nfor number, task in enumerate(tasks, start=1):\n    print(f"{number}. {task}")', output("1. 阅读", "3. 复盘")),
      ex("a8", "独立", "列表求和", "用循环计算列表中所有数字的总和，不使用 sum()。", 'numbers = [3, 5, 7, 9]\ntotal = 0\n', "输出 24。", 'numbers = [3, 5, 7, 9]\ntotal = 0\nfor number in numbers:\n    total += number\nprint(total)', output("24")),
      ex("a9", "独立", "筛选长名字", "只输出长度大于 2 的名字。", 'names = ["小王", "欧阳明", "李丽", "司马小雨"]\n', "输出欧阳明、司马小雨，不输出小王。", 'names = ["小王", "欧阳明", "李丽", "司马小雨"]\nfor name in names:\n    if len(name) > 2:\n        print(name)', output("欧阳明", "司马小雨")),
      ex("a10", "综合", "找出最高分", "用循环找出 scores 的最高分，不使用 max()。", 'scores = [72, 88, 95, 81]\nhighest = scores[0]\n', "输出 95。", 'scores = [72, 88, 95, 81]\nhighest = scores[0]\nfor score in scores:\n    if score > highest:\n        highest = score\nprint(highest)', both(["95"], ["for", "if"]))
    ]
  },
  {
    id: "wb-functions", number: 7, title: "函数强化训练", subtitle: "把输入、过程和输出分开理解",
    focus: ["def 与调用", "参数", "return"],
    exercises: [
      ex("f1", "模仿", "定义问候函数", "定义 greet()，调用时输出“你好”。", "", "输出你好，并使用 def。", 'def greet():\n    print("你好")\n\ngreet()', both(["你好"], ["def", "greet()"])),
      ex("f2", "补全", "调用函数", "函数已经定义，补上调用。", 'def say_ready():\n    print("准备好了")\n\n# 调用', "输出准备好了。", 'def say_ready():\n    print("准备好了")\n\nsay_ready()', output("准备好了")),
      ex("f3", "改错", "定义不等于运行", "程序没有输出。补上真正执行函数的代码。", 'def show_message():\n    print("函数运行了")', "输出函数运行了。", 'def show_message():\n    print("函数运行了")\n\nshow_message()', output("函数运行了")),
      ex("f4", "补全", "接收参数", "补全 name 参数与欢迎语。", 'def welcome(# 参数):\n    print(f"欢迎{# 变量}")\n\nwelcome("小安")', "输出欢迎小安。", 'def welcome(name):\n    print(f"欢迎{name}")\n\nwelcome("小安")', output("欢迎小安")),
      ex("f5", "改错", "return 才能送回结果", "修复函数，让 print(add(2,3)) 输出 5。", 'def add(a, b):\n    result = a + b\n\nprint(add(2, 3))', "输出 5，并使用 return。", 'def add(a, b):\n    result = a + b\n    return result\n\nprint(add(2, 3))', both(["5"], ["return"])),
      ex("f6", "独立", "判断及格", "定义 is_pass(score)，分数大于等于 60 返回 True，否则 False。调用 75。", "", "输出 True。", 'def is_pass(score):\n    if score >= 60:\n        return True\n    return False\n\nprint(is_pass(75))', both(["True"], ["def", "return"])),
      ex("f7", "独立", "格式化任务", "定义 format_task(number,title)，返回“1. □ 阅读”格式。", "", "输出 1. □ 阅读。", 'def format_task(number, title):\n    return f"{number}. □ {title}"\n\nprint(format_task(1, "阅读"))', output("1. □ 阅读")),
      ex("f8", "改错", "参数数量要对应", "修复调用，让函数正常输出 12。", 'def multiply(a, b):\n    return a * b\n\nprint(multiply(4))', "输出 12。", 'def multiply(a, b):\n    return a * b\n\nprint(multiply(4, 3))', output("12")),
      ex("f9", "独立", "函数配合列表", "定义 total(numbers)，用循环累计列表并返回总和。", "", "调用 [2,4,6] 输出 12。", 'def total(numbers):\n    result = 0\n    for number in numbers:\n        result += number\n    return result\n\nprint(total([2, 4, 6]))', both(["12"], ["def", "for", "return"])),
      ex("f10", "综合", "拆分成绩报告", "定义 get_level(score) 返回优秀、及格或继续努力，再用它输出“成绩：优秀”。", 'score = 92\n# 定义函数并输出报告', "输出成绩：优秀。", 'def get_level(score):\n    if score >= 90:\n        return "优秀"\n    elif score >= 60:\n        return "及格"\n    return "继续努力"\n\nscore = 92\nprint(f"成绩：{get_level(score)}")', both(["成绩：优秀"], ["def", "return"]))
    ]
  },
  {
    id: "wb-projects", number: 8, title: "综合基础应用", subtitle: "不跨级，只把基础零件组合起来",
    focus: ["问题拆分", "组合基础语法", "独立完成"],
    exercises: [
      ex("m1", "补全", "任务计数器", "输出任务总数和第一项。", 'tasks = ["阅读", "练习", "复盘"]\n# 输出任务总数\n# 输出第一项', "输出 3 和阅读。", 'tasks = ["阅读", "练习", "复盘"]\nprint(len(tasks))\nprint(tasks[0])', output("3", "阅读")),
      ex("m2", "独立", "合格人数", "统计 scores 中大于等于 60 的人数。", 'scores = [55, 72, 90, 48, 61]\ncount = 0\n', "输出合格人数3。", 'scores = [55, 72, 90, 48, 61]\ncount = 0\nfor score in scores:\n    if score >= 60:\n        count += 1\nprint(f"合格人数{count}")', output("合格人数3")),
      ex("m3", "独立", "购物总价", "列表 prices 保存价格，用循环求和并输出总价。", 'prices = [12.5, 8, 20]\n', "输出总价40.5。", 'prices = [12.5, 8, 20]\ntotal = 0\nfor price in prices:\n    total += price\nprint(f"总价{total}")', output("总价40.5")),
      ex("m4", "改错", "修好任务展示器", "修复代码的索引和缩进错误。", 'tasks = ["阅读", "练习"]\nfor i in range(len(tasks)):\nprint(f"{i + 1}. {tasks[i + 1]}")', "输出 1. 阅读 和 2. 练习。", 'tasks = ["阅读", "练习"]\nfor i in range(len(tasks)):\n    print(f"{i + 1}. {tasks[i]}")', output("1. 阅读", "2. 练习")),
      ex("m5", "综合", "待办状态展示", "逐项输出 ✓ 或 □ 加任务名。", 'tasks = [\n    {"title": "阅读", "done": True},\n    {"title": "练习", "done": False}\n]\n', "输出 ✓ 阅读 和 □ 练习。", 'tasks = [\n    {"title": "阅读", "done": True},\n    {"title": "练习", "done": False}\n]\nfor task in tasks:\n    mark = "✓" if task["done"] else "□"\n    print(f"{mark} {task[\'title\']}")', output("✓ 阅读", "□ 练习")),
      ex("m6", "综合", "数字猜测判断", "secret=7、guess=5，输出“太小了”；同时支持太大和猜对分支。", 'secret = 7\nguess = 5\n', "当前输出太小了，并包含三种分支。", 'secret = 7\nguess = 5\nif guess < secret:\n    print("太小了")\nelif guess > secret:\n    print("太大了")\nelse:\n    print("猜对了")', both(["太小了"], ["if", "elif", "else"])),
      ex("m7", "综合", "学习打卡摘要", "定义函数 summary(days)，输出每一天并返回总天数。", 'days = ["周一", "周二", "周三"]\n', "输出三个日期和“共3天”。", 'days = ["周一", "周二", "周三"]\ndef summary(days):\n    for day in days:\n        print(day)\n    return len(days)\n\nprint(f"共{summary(days)}天")', both(["周一", "周三", "共3天"], ["def", "for", "return"])),
      ex("m8", "综合", "独立任务助手", "从空白开始：建立任务列表，定义 add_task 和 show_tasks，添加两项并显示编号。", "", "输出两项带编号任务，并使用两个函数。", 'tasks = []\n\ndef add_task(title):\n    tasks.append(title)\n\ndef show_tasks():\n    for number, task in enumerate(tasks, start=1):\n        print(f"{number}. □ {task}")\n\nadd_task("复习循环")\nadd_task("练习函数")\nshow_tasks()', both(["1. □ 复习循环", "2. □ 练习函数"], ["def add_task", "def show_tasks", "append", "for"]))
    ]
  }
];

export const workbookExerciseCount = workbookUnits.reduce((sum, unit) => sum + unit.exercises.length, 0);
