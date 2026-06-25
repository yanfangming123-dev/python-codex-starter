import type { Lesson } from "./types";

export const lessons: Lesson[] = [
  {
    id: "hello",
    number: 1,
    title: "让电脑说句话",
    eyebrow: "代码是什么",
    duration: "15 分钟",
    goal: "理解代码是给电脑的明确指令，并运行第一行 Python。",
    analogy: "代码像一张写给非常认真的厨师的菜谱。它不会猜你的心思，但会一行一行照着做。",
    explanation: [
      "Python 程序由一条条指令组成。电脑通常从上到下执行它们。",
      "print() 的作用是把括号里的内容显示出来。文字要放在英文引号里，这样 Python 才知道它是一段文字。"
    ],
    keyPoints: ["代码从上往下运行", "print() 用来显示内容", "文字需要英文引号"],
    exampleCode: 'print("你好，代码世界！")\nprint("我刚刚运行了第一段 Python。")',
    exercises: [
      {
        id: "hello-name",
        title: "向世界介绍自己",
        task: "修改代码，让程序输出“你好，我是小明”（也可以换成你的名字）。",
        starterCode: 'print("请修改我")',
        expected: "输出中需要出现“你好，我是”。",
        hints: ["先保留 print 和括号。", "把括号里的文字换成你的自我介绍。"],
        answer: 'print("你好，我是小明")',
        validation: { type: "outputIncludes", values: ["你好", "我是"] }
      },
      {
        id: "hello-lines",
        title: "连续发出两条指令",
        task: "写两行 print，第一行输出“开始学习”，第二行输出“保持好奇”。",
        starterCode: 'print("开始学习")\n# 在下面写第二行',
        expected: "输出两行指定文字。",
        hints: ["每一行都可以是一条完整的 print 指令。", "井号开头的是注释，Python 不会执行它。"],
        answer: 'print("开始学习")\nprint("保持好奇")',
        validation: { type: "outputIncludes", values: ["开始学习", "保持好奇"] }
      }
    ],
    codexTip: "请不要直接给答案。先用生活中的例子解释 Python 的 print()，再检查我的代码为什么没有按预期显示文字。"
  },
  {
    id: "variables",
    number: 2,
    title: "给信息贴标签",
    eyebrow: "变量与数据类型",
    duration: "20 分钟",
    goal: "学会用变量保存文字、数字和真假状态。",
    analogy: "变量像贴了标签的收纳盒。盒子叫 name，里面可以放“阿宁”；以后只要说 name，就能找到那份信息。",
    explanation: [
      "等号 = 在 Python 里表示“把右边的值放进左边这个变量”。变量名应简短、清楚，不能有空格。",
      "常见数据有文字（str）、整数（int）、小数（float）和真假（bool）。不同数据能做的事情不同。"
    ],
    keyPoints: ["= 用来赋值", "变量名表达信息含义", "文字、数字、真假是不同类型"],
    exampleCode: 'name = "小夏"\nage = 18\nis_learning = True\n\nprint(name)\nprint(age)\nprint(is_learning)',
    exercises: [
      {
        id: "variables-card",
        title: "制作个人信息卡",
        task: "创建 name 和 city 两个变量，并分别输出它们。",
        starterCode: '# 创建两个变量\n\n# 输出两个变量',
        expected: "代码中创建 name、city，并输出你填写的内容。",
        hints: ["写法是 name = \"你的名字\"。", "输出变量时不需要给变量名加引号。"],
        answer: 'name = "小夏"\ncity = "上海"\nprint(name)\nprint(city)',
        validation: { type: "codeIncludes", values: ["name", "city", "print"] }
      },
      {
        id: "variables-types",
        title: "认识数据类型",
        task: "用 type() 查看 42 和“42”的类型，并输出结果。",
        starterCode: 'print(type(42))\n# 再查看文字 "42" 的类型',
        expected: "输出中同时出现 int 和 str。",
        hints: ["照着第一行再写一行。", "第二个 42 要放在英文引号中。"],
        answer: 'print(type(42))\nprint(type("42"))',
        validation: { type: "outputIncludes", values: ["int", "str"] }
      }
    ],
    codexTip: "请像老师一样提问，引导我判断下面每个值是文字、整数、小数还是真假值；如果我答错，请解释区别。"
  },
  {
    id: "strings-math",
    number: 3,
    title: "让数据动起来",
    eyebrow: "字符串与运算",
    duration: "25 分钟",
    goal: "组合文字、进行计算，并把结果放进完整句子。",
    analogy: "数据不是只放在盒子里看。运算符像工作台：数字可以加减乘除，文字也可以像积木一样拼接。",
    explanation: [
      "数字支持 +、-、*、/。Python 会遵守先乘除后加减，也可以用括号改变顺序。",
      "f-string 能把变量自然地嵌进文字：在引号前加 f，再把变量放进花括号中。"
    ],
    keyPoints: ["数字可以直接计算", "f-string 用 f 开头", "花括号中填写变量名"],
    exampleCode: 'apples = 4\nprice = 3.5\ntotal = apples * price\nprint(f"{apples} 个苹果一共 {total} 元")',
    exercises: [
      {
        id: "math-total",
        title: "计算购物金额",
        task: "已有单价和数量，请计算 total，并输出结果。",
        starterCode: 'price = 8\ncount = 3\n# 计算 total\n# 输出 total',
        expected: "输出 24。",
        hints: ["总价等于单价乘以数量。", "先写 total = price * count，再输出。"],
        answer: 'price = 8\ncount = 3\ntotal = price * count\nprint(total)',
        validation: { type: "outputIncludes", values: ["24"] }
      },
      {
        id: "string-greeting",
        title: "生成欢迎语",
        task: "使用 f-string 输出“欢迎小林，你已经学习3课了”。",
        starterCode: 'name = "小林"\nlesson_count = 3\n# 用上面两个变量生成欢迎语',
        expected: "输出中包含姓名、数字 3 和“欢迎”。",
        hints: ["引号前不要忘记 f。", "变量写在 { } 里。"],
        answer: 'name = "小林"\nlesson_count = 3\nprint(f"欢迎{name}，你已经学习{lesson_count}课了")',
        validation: { type: "outputIncludes", values: ["欢迎", "小林", "3"] }
      }
    ],
    codexTip: "请检查我的计算过程，但先不要重写代码。告诉我每个变量当前装着什么，以及程序按什么顺序完成运算。"
  },
  {
    id: "conditions",
    number: 4,
    title: "教程序做决定",
    eyebrow: "条件判断",
    duration: "25 分钟",
    goal: "使用 if、elif、else 根据不同情况执行不同代码。",
    analogy: "条件判断像出门前看天气：如果下雨就带伞，否则戴太阳镜。程序也能沿着不同岔路行动。",
    explanation: [
      "if 后面写一个结果为真或假的条件。条件为真时，执行下面缩进的代码。",
      "elif 可以继续判断其他情况，else 负责接住剩余情况。冒号和四个空格的缩进都不能少。"
    ],
    keyPoints: ["if 后写条件和冒号", "缩进表示代码属于哪个分支", "== 比较是否相等"],
    exampleCode: 'score = 82\n\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("通过")\nelse:\n    print("继续加油")',
    exercises: [
      {
        id: "condition-age",
        title: "判断是否成年",
        task: "如果 age 大于等于 18，输出“可以进入”；否则输出“暂不能进入”。",
        starterCode: 'age = 16\n\n# 写下条件判断',
        expected: "当前 age 为 16，应输出“暂不能进入”。",
        hints: ["第一行条件是 if age >= 18:", "else 后也需要冒号，两边的 print 都要缩进。"],
        answer: 'age = 16\nif age >= 18:\n    print("可以进入")\nelse:\n    print("暂不能进入")',
        validation: { type: "outputIncludes", values: ["暂不能进入"] }
      },
      {
        id: "condition-password",
        title: "检查口令",
        task: "当 password 等于“codex”时输出“登录成功”，否则输出“口令错误”。",
        starterCode: 'password = "python"\n\n# 使用 == 比较',
        expected: "当前口令应输出“口令错误”。",
        hints: ["判断相等使用两个等号 ==。", "文字 codex 也要放在引号中。"],
        answer: 'password = "python"\nif password == "codex":\n    print("登录成功")\nelse:\n    print("口令错误")',
        validation: { type: "both", output: ["口令错误"], code: ["==", "if", "else"] }
      }
    ],
    codexTip: "我的条件判断结果不对。请先逐行说明程序实际走了哪条路，再给我一个小提示；只有我追问时才给修改后的完整代码。"
  },
  {
    id: "loops",
    number: 5,
    title: "把重复交给循环",
    eyebrow: "循环",
    duration: "25 分钟",
    goal: "使用 for 和 range() 自动执行重复任务。",
    analogy: "循环像给复印机说“印 5 份”，不需要把同一条指令手写 5 遍。代码因此更短，也更容易修改。",
    explanation: [
      "for 会依次取出一组数据中的每一项，并执行缩进的代码。",
      "range(1, 6) 会产生 1 到 5。结尾数字 6 不包含在其中，这是初学时最常见的小陷阱。"
    ],
    keyPoints: ["for 负责依次处理", "range 的结尾不包含", "循环体需要缩进"],
    exampleCode: 'for number in range(1, 6):\n    print(f"第 {number} 次练习")',
    exercises: [
      {
        id: "loop-count",
        title: "从 1 数到 5",
        task: "使用 for 和 range，让程序依次输出 1、2、3、4、5。",
        starterCode: '# 写一个 for 循环',
        expected: "输出中依次出现 1 到 5。",
        hints: ["可以使用 range(1, 6)。", "循环中的 print 要缩进。"],
        answer: 'for number in range(1, 6):\n    print(number)',
        validation: { type: "both", output: ["1", "2", "3", "4", "5"], code: ["for", "range"] }
      },
      {
        id: "loop-sum",
        title: "累计总和",
        task: "用循环计算 1 + 2 + 3 + 4 + 5，并输出 total。",
        starterCode: 'total = 0\nfor number in range(1, 6):\n    # 把 number 加到 total\n\nprint(total)',
        expected: "输出 15。",
        hints: ["循环中可以写 total = total + number。", "最后的 print 不要缩进，它在循环结束后执行。"],
        answer: 'total = 0\nfor number in range(1, 6):\n    total = total + number\nprint(total)',
        validation: { type: "outputIncludes", values: ["15"] }
      }
    ],
    codexTip: "请用表格模拟这段循环，每一轮列出 number 和 total 的值，帮我理解变量是怎样一步步变化的。"
  },
  {
    id: "lists",
    number: 6,
    title: "一次保存许多信息",
    eyebrow: "列表",
    duration: "25 分钟",
    goal: "创建、读取、添加列表项目，并配合循环处理它们。",
    analogy: "列表像一列购物清单。每一项都有位置，可以追加新项目，也可以从头到尾逐项查看。",
    explanation: [
      "列表使用方括号，项目之间用逗号隔开。位置编号从 0 开始，所以 tasks[0] 是第一项。",
      "append() 会在列表末尾添加项目。for 循环特别适合逐个处理列表中的内容。"
    ],
    keyPoints: ["列表用 [ ]", "第一项的位置是 0", "append() 添加项目"],
    exampleCode: 'tasks = ["读一页书", "散步", "学 Python"]\ntasks.append("问 Codex 一个好问题")\n\nfor task in tasks:\n    print(f"□ {task}")',
    exercises: [
      {
        id: "list-fruits",
        title: "扩充水果清单",
        task: "向 fruits 添加“橙子”，然后用循环输出所有水果。",
        starterCode: 'fruits = ["苹果", "香蕉"]\n# 添加橙子\n# 循环输出',
        expected: "输出苹果、香蕉和橙子。",
        hints: ["使用 fruits.append(\"橙子\")。", "写 for fruit in fruits:，下一行输出 fruit。"],
        answer: 'fruits = ["苹果", "香蕉"]\nfruits.append("橙子")\nfor fruit in fruits:\n    print(fruit)',
        validation: { type: "both", output: ["苹果", "香蕉", "橙子"], code: ["append", "for"] }
      },
      {
        id: "list-first",
        title: "读取第一项",
        task: "输出列表中的第一项和列表长度。",
        starterCode: 'tools = ["Codex", "Python", "浏览器"]\n# 输出第一项\n# 输出长度，提示：len(tools)',
        expected: "输出 Codex 和 3。",
        hints: ["第一项是 tools[0]。", "len() 可以数出列表里有几项。"],
        answer: 'tools = ["Codex", "Python", "浏览器"]\nprint(tools[0])\nprint(len(tools))',
        validation: { type: "outputIncludes", values: ["Codex", "3"] }
      }
    ],
    codexTip: "请画出这个列表的索引和值，并解释为什么第一项是 0。然后出一道相似但不完全相同的小题让我练习。"
  },
  {
    id: "functions",
    number: 7,
    title: "把步骤打包复用",
    eyebrow: "函数",
    duration: "30 分钟",
    goal: "定义带参数和返回值的函数，把大问题拆成小步骤。",
    analogy: "函数像一台命名好的小机器：投入原料（参数），它按固定步骤工作，再交出产品（返回值）。",
    explanation: [
      "def 用来定义函数。函数在被调用之前只是说明书，调用时才真正运行。",
      "参数让同一个函数处理不同输入，return 把结果送回调用它的位置。"
    ],
    keyPoints: ["def 定义函数", "参数是函数接收的信息", "return 返回结果"],
    exampleCode: 'def make_greeting(name):\n    message = f"你好，{name}！今天也来写一点代码吧。"\n    return message\n\nprint(make_greeting("小夏"))',
    exercises: [
      {
        id: "function-double",
        title: "制作翻倍机器",
        task: "完成 double(number)，让它返回 number 的两倍。调用 double(6) 应输出 12。",
        starterCode: 'def double(number):\n    # 返回两倍结果\n\nprint(double(6))',
        expected: "输出 12，且代码使用 return。",
        hints: ["返回结果写作 return number * 2。", "函数内部的 return 要缩进。"],
        answer: 'def double(number):\n    return number * 2\n\nprint(double(6))',
        validation: { type: "both", output: ["12"], code: ["def", "return"] }
      },
      {
        id: "function-task",
        title: "格式化任务",
        task: "定义 show_task(task)，返回“□ ”加上任务文字，并调用它输出“□ 学习函数”。",
        starterCode: 'def show_task(task):\n    # 返回格式化后的文字\n\n# 调用函数',
        expected: "输出“□ 学习函数”。",
        hints: ["可以 return f\"□ {task}\"。", "调用时把“学习函数”作为参数。"],
        answer: 'def show_task(task):\n    return f"□ {task}"\n\nprint(show_task("学习函数"))',
        validation: { type: "outputIncludes", values: ["□ 学习函数"] }
      }
    ],
    codexTip: "请评审我的函数：它的名字是否清楚、参数是否必要、返回值是否合理？先给建议清单，不要直接替我重写。"
  },
  {
    id: "project",
    number: 8,
    title: "个人任务助手",
    eyebrow: "结课项目",
    duration: "40 分钟",
    goal: "综合变量、条件、循环、列表和函数，完成一个迷你任务助手。",
    analogy: "前七课学的是零件，这一课把零件装成一台真正能用的小机器。你不必一次写完，程序员也是一块一块搭起来的。",
    explanation: [
      "先建立任务列表，再用函数负责添加、展示和完成任务。每个函数只做一件事，程序会更容易理解。",
      "项目代码故意从简单版本开始。完成后，可以把需求清楚地交给 Codex，请它协助增加删除任务、保存数据等功能。"
    ],
    keyPoints: ["先拆功能再动手", "每次只验证一小步", "让 Codex 解释改动并由你亲自运行"],
    exampleCode: 'tasks = []\n\ndef add_task(title):\n    tasks.append({"title": title, "done": False})\n\ndef show_tasks():\n    for index, task in enumerate(tasks, start=1):\n        mark = "✓" if task["done"] else "□"\n        print(f"{index}. {mark} {task[\'title\']}")\n\nadd_task("完成 Python 初级课")\nadd_task("向 Codex 描述一个新功能")\nshow_tasks()',
    exercises: [
      {
        id: "project-add-show",
        title: "第一步：添加与展示",
        task: "补全 add_task 和 show_tasks，让程序保存任务并逐项输出。",
        starterCode: 'tasks = []\n\ndef add_task(title):\n    # 把 title 添加到 tasks\n\ndef show_tasks():\n    # 循环输出 tasks\n\nadd_task("整理书桌")\nadd_task("学习 Python")\nshow_tasks()',
        expected: "输出“整理书桌”和“学习 Python”。",
        hints: ["先使用 tasks.append(title)。", "show_tasks 中用 for task in tasks 循环。"],
        answer: 'tasks = []\n\ndef add_task(title):\n    tasks.append(title)\n\ndef show_tasks():\n    for task in tasks:\n        print(f"□ {task}")\n\nadd_task("整理书桌")\nadd_task("学习 Python")\nshow_tasks()',
        validation: { type: "both", output: ["整理书桌", "学习 Python"], code: ["append", "for", "def"] }
      },
      {
        id: "project-complete",
        title: "第二步：完成任务",
        task: "补全 complete_task(index)，把指定任务的 done 改成 True。运行后第一项应显示 ✓。",
        starterCode: 'tasks = [\n    {"title": "整理书桌", "done": False},\n    {"title": "学习 Python", "done": False}\n]\n\ndef complete_task(index):\n    # 把指定任务标记为完成\n\ndef show_tasks():\n    for task in tasks:\n        mark = "✓" if task["done"] else "□"\n        print(f"{mark} {task[\'title\']}")\n\ncomplete_task(0)\nshow_tasks()',
        expected: "输出中出现“✓ 整理书桌”和“□ 学习 Python”。",
        hints: ["指定任务是 tasks[index]。", "把它的 [\"done\"] 设置为 True。"],
        answer: 'tasks = [\n    {"title": "整理书桌", "done": False},\n    {"title": "学习 Python", "done": False}\n]\n\ndef complete_task(index):\n    tasks[index]["done"] = True\n\ndef show_tasks():\n    for task in tasks:\n        mark = "✓" if task["done"] else "□"\n        print(f"{mark} {task[\'title\']}")\n\ncomplete_task(0)\nshow_tasks()',
        validation: { type: "both", output: ["✓ 整理书桌", "□ 学习 Python"], code: ["True", "index", "done"] }
      }
    ],
    codexTip: "我完成了一个 Python 任务助手。请先阅读代码并概括结构，再提出 3 个由易到难的新功能。每次只陪我实现一个，并解释每处改动。"
  }
];

export const codexFramework = `你是我的 Python 入门陪练，请不要立刻给完整答案。

【我的目标】
（我想让程序做什么）

【我的代码】
（粘贴当前代码）

【实际结果】
（粘贴输出或报错）

【期望结果】
（我原本希望看到什么）

请先用简单中文解释原因，再给一个最小提示。等我尝试后，再帮我检查。`;
