// 站点内容数据 —— 由 tools/build.mjs 读取并生成静态页面
// 图片均已通过 tools/prepare-images.ps1 优化并放入 img/work/

export const SITE = {
  name: '李家起',
  en: 'LI JIAQI',
  initials: 'LMJB',
  role: '数字媒体艺术 · 视觉与游戏设计',
  email: '2437597827@qq.com',
  phone: '+173 5929 4104',
  phoneHref: '+8617359294104',
  location: '福建 · 厦门 / 福州',
  school: '福州大学',
  major: '数字媒体艺术（本科）',
  years: '2023 — 2026',
  intro:
    '数字媒体艺术在读，关注游戏策划、场景美术与视觉叙事。习惯从一束光、一个空间或一行字开始，把想法做成可以走进去的画面。',
  about:
    '我是李家起，福州大学数字媒体艺术专业在读。喜欢游戏、电影和音乐，也喜欢把看到的光、空间和情绪留下来。我的作品在平面、场景与游戏原型之间来回：有时从一张海报开始，有时从一间屋子开始。',
  statement: '把故事放进画面里，让画面自己说话。',
  stats: [
    { value: '06', label: '组作品', en: 'PROJECTS' },
    { value: '38', label: '件作品文件', en: 'PIECES' },
    { value: '03', label: '年持续创作', en: 'YEARS' }
  ],
  awards: [
    '第三届集美学村文化艺术节 · 风筝绘画大赛 三等奖',
    '第十五届蓝桥杯大赛 · 视觉艺术设计赛 二等奖',
    'NCDA 未来设计师 · 全国高校数字艺术设计大赛 三等奖',
    '2025 年闽台大学生闽南方言短视频创作大赛 三等奖',
    '第十五届中国大学生计算机设计大赛 · 福建省级赛 二等奖'
  ],
  tools: [
    'Unreal Engine',
    'Clip Studio Paint',
    'Photoshop',
    'Illustrator',
    'Premiere Pro',
    'Aseprite'
  ],
  socials: [
    { label: 'GitHub', href: '#!', icon: 'gitHub.svg' },
    { label: 'Instagram', href: '#!', icon: 'instagram.svg' },
    { label: 'LinkedIn', href: '#!', icon: 'linkedIn.svg' }
  ]
};

export const PROJECTS = [
  {
    id: 1,
    no: '01',
    file: 'project-1.html',
    title: '平面设计',
    en: 'GRAPHIC DESIGN',
    kicker: '字体、海报与概念场景',
    year: '2023 — 2025',
    type: '海报 / 概念视觉',
    tools: 'Photoshop · Illustrator',
    count: '07',
    cover: 'img/work/p1/poster-landscape.jpg',
    coverW: 1800,
    coverH: 1273,
    coverAlt: '《苍猊》横版字体海报，篆隶风格汉字铺满深灰底',
    lead: 'img/work/p1/poster-landscape.jpg',
    leadW: 1800,
    leadH: 1273,
    leadCaption: '《苍猊》横版海报 · 3508 × 2480',
    intro:
      '从汉字结构到场景光影的一组视觉练习。双版《苍猊》海报把角色名拆成笔画与纹理；同一场景的线稿、色稿与氛围稿并置，呈现从结构到情绪的推演。',
    statement: '文字不只是信息的容器，它也可以是画面里最重的结构。',
    tags: ['字体设计', '海报', '概念场景'],
    blocks: [
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 4,
            ar: '3 / 4',
            src: 'img/work/p1/poster-portrait.jpg',
            w: 1273,
            h: 1800,
            title: '《苍猊》· 竖版海报',
            meta: '字体 / 角色视觉 · 2480 × 3508',
            alt: '《苍猊》竖版海报，黑色汉字与密集文字纹理'
          },
          {
            kind: 'image',
            span: 8,
            ar: '7 / 5',
            src: 'img/work/p1/poster-landscape.jpg',
            w: 1800,
            h: 1273,
            title: '《苍猊》· 横版海报',
            meta: '字体 / 版式实验 · 3508 × 2480',
            alt: '《苍猊》横版海报，篆书汉字与暗色纹理'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p1/scene-fantasy-night.jpg',
            w: 1800,
            h: 1012,
            title: '幻想氛围',
            meta: '场景色稿 · 夜色与暖光',
            alt: '暖色光线中的修理厂场景概念图'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p1/scene-reality-afternoon.jpg',
            w: 1800,
            h: 1012,
            title: '现实氛围',
            meta: '场景色稿 · 午后室内',
            alt: '午后阳光照进堆满箱子的房间场景概念图'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p1/lineart-workshop.jpg',
            w: 1800,
            h: 1012,
            title: '修理厂 · 线稿',
            meta: '场景结构 / 透视推敲',
            alt: '修理厂内部的黑白场景线稿'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p1/lineart-study.jpg',
            w: 1800,
            h: 1012,
            title: '卧室 · 线稿',
            meta: '场景结构 / 物件布置',
            alt: '卧室内部的黑白场景线稿'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 12,
            ar: '16 / 9',
            src: 'img/work/p1/lineart-room-iso.jpg',
            w: 1800,
            h: 1012,
            title: '房间 · 等轴测线稿',
            meta: '空间研究 / 从平面到体块',
            alt: '房间的等轴测黑白线稿'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    no: '02',
    file: 'project-2.html',
    title: '游戏策划',
    en: 'GAME DESIGN',
    kicker: '玩法原型、关卡与视觉',
    year: '2023 — 2025',
    type: '玩法原型 / 关卡设计',
    tools: 'Unreal Engine · Blueprint',
    count: '08',
    cover: 'img/work/p2/fps-yard.jpg',
    coverW: 1800,
    coverH: 979,
    coverAlt: '第一人称游戏中的庭院场景，阳光穿过树影',
    lead: 'img/work/p2/fps-yard.jpg',
    leadW: 1800,
    leadH: 979,
    leadCaption: '第一人称原型 · 庭院场景 / Unreal Engine',
    intro:
      '从 2D 平台跳跃到第一人称原型，再到《夜巡》的开场空间。这一组记录玩法从纸面到引擎的过程：关卡节奏、收集与轻战斗、白盒光照，以及一张不太安分的主视觉。',
    statement: '先让空间讲清楚规则，再让规则长出情绪。',
    tags: ['玩法原型', '关卡节奏', 'Unreal Engine'],
    blocks: [
      {
        type: 'feature',
        span: 5,
        item: {
          kind: 'image',
          ar: '3 / 5',
          src: 'img/work/p2/poster-dont-press.jpg',
          w: 1080,
          h: 1800,
          title: '主视觉 · 《别按那个键》',
          meta: '角色 / 版式 / 宣传海报',
          alt: '《别按那个键》游戏宣传海报，高饱和角色与密集信息'
        },
        eyebrow: 'KEY VISUAL / 主视觉',
        quote: '“别按”——但所有人都会按。',
        body:
          '海报把“按下去”的冲动做成视觉冲突：高饱和角色、密集信息与警告色叠在一起，像一张不太安分的招募令。',
        tags: ['角色', '版式', '宣传']
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/fps-yard.jpg',
            w: 1800,
            h: 979,
            title: '庭院 · 场景展示',
            meta: '第一人称原型 / 光影与植被',
            alt: '第一人称游戏庭院场景，树木与建筑围合'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/platformer-01.jpg',
            w: 1800,
            h: 1041,
            title: '2D 平台跳跃 · 关卡 01',
            meta: '关卡节奏 / 收集物系统',
            alt: '2D 平台跳跃游戏截图，洞窟场景与角色'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/platformer-02.jpg',
            w: 1120,
            h: 714,
            title: '2D 平台跳跃 · 关卡 02',
            meta: '轻战斗 / 机关与路径',
            alt: '2D 平台跳跃游戏截图，绿色地下空间与角色'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/fps-blockout.jpg',
            w: 1268,
            h: 770,
            title: '第一人称原型 · 白盒',
            meta: '空间尺度 / 视线与动线',
            alt: '第一人称游戏白盒场景，雪地与树阵'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/fps-demo-01.jpg',
            w: 783,
            h: 476,
            title: '第一人称原型 · 交互测试',
            meta: '机关触发 / 反馈验证',
            alt: '第一人称游戏测试画面，黑色场景与红色方块'
          },
          {
            kind: 'note',
            span: 6,
            eyebrow: 'PROCESS / 02',
            title: '玩法、关卡与程序',
            body:
              '参与立项讨论，协助项目推进；负责部分玩法设计与关卡搭建，并作为主要程序完成原型验证。',
            tags: ['收集物', '轻战斗', '关卡节奏']
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/nightwalk-01.gif',
            w: 1280,
            h: 720,
            gif: true,
            title: '《夜巡》· 开场',
            meta: '动态影像 / CLEAR GHOST',
            alt: '《夜巡》游戏开场画面，黑暗走廊与书法标题'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p2/nightwalk-02.gif',
            w: 1280,
            h: 720,
            gif: true,
            title: '《夜巡》· 场景',
            meta: '动态影像 / 氛围与镜头',
            alt: '《夜巡》游戏场景，昏暗走廊与房间'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    no: '03',
    file: 'project-3.html',
    title: '非线性编辑',
    en: 'POST-PRODUCTION',
    kicker: '动画时间轴与实时镜头',
    year: '2024 — 2025',
    type: '动画 / 实时影像',
    tools: 'Clip Studio Paint · Unreal Engine',
    count: '03',
    cover: 'img/work/p3/ue-corridor-deer.jpg',
    coverW: 1269,
    coverH: 713,
    coverAlt: '白色车厢场景中出现一只鹿，超现实画面',
    lead: 'img/work/p3/ue-corridor-deer.jpg',
    leadW: 1269,
    leadH: 713,
    leadCaption: '实时场景 · 车厢与鹿 / Unreal Engine',
    intro:
      '从动画时间轴到引擎内实时镜头，这一组关注“剪辑”如何在时间与空间之间建立节奏：CSP 里的逐帧组织，UE 中的灯光、材质与镜头运动。',
    statement: '剪辑不是把镜头接起来，而是决定观众在第几秒呼吸。',
    tags: ['逐帧动画', '实时渲染', '镜头节奏'],
    blocks: [
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 12,
            ar: '16 / 9',
            src: 'img/work/p3/csp-editing.jpg',
            w: 1280,
            h: 720,
            title: '动画时间轴',
            meta: 'Clip Studio Paint / 逐帧与图层组织',
            alt: 'Clip Studio Paint 动画时间轴工作界面'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p3/ue-corridor-green.jpg',
            w: 1267,
            h: 709,
            title: '走廊 · 灯光测试',
            meta: 'Unreal Engine / 绿色光源与反射',
            alt: 'Unreal Engine 绿色灯光走廊场景'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p3/ue-corridor-deer.jpg',
            w: 1269,
            h: 713,
            title: '车厢与鹿 · 镜头测试',
            meta: 'Unreal Engine / 超现实空间',
            alt: 'Unreal Engine 白色车厢场景与鹿'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    no: '04',
    file: 'project-4.html',
    title: '场景美术',
    en: 'ENVIRONMENT ART',
    kicker: '园林、森林与室内空间',
    year: '2024 — 2025',
    type: '场景设计 / 空间叙事',
    tools: 'Unreal Engine · Photoshop',
    count: '07',
    cover: 'img/work/p4/garden-pavilion.jpg',
    coverW: 1037,
    coverH: 519,
    coverAlt: '苏南园林场景，水池、亭子与假山',
    lead: 'img/work/p4/garden-pavilion.jpg',
    leadW: 1037,
    leadH: 519,
    leadCaption: '苏南园林 · 场景重建 / Unreal Engine',
    intro:
      '场景是情绪的容器。这一组从苏南园林、林间空地到室内白盒，尝试用光、材质与构图建立叙事：既是世界观的空间，也是镜头里的舞台。',
    statement: '光落在哪里，故事就从哪里开始。',
    tags: ['场景重建', '光影', '空间叙事'],
    blocks: [
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 12,
            ar: '2 / 1',
            src: 'img/work/p4/garden-pavilion.jpg',
            w: 1037,
            h: 519,
            title: '苏南园林 · 场景重建',
            meta: 'Unreal Engine / 水体、假山与亭榭',
            alt: '苏南园林场景，池水倒映亭子与假山'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/forest-ancient-tree.jpg',
            w: 1266,
            h: 694,
            title: '林间 · 古树与地形',
            meta: '自然环境 / 植被与雾',
            alt: '游戏森林场景，古树与草地'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/scene-blueprint.jpg',
            w: 1134,
            h: 759,
            title: '关卡蓝图 · 场景搭建',
            meta: 'Unreal Engine / 模块与灯光',
            alt: 'Unreal Engine 蓝图编辑器中的场景搭建界面'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/scene-platformer.jpg',
            w: 1800,
            h: 1041,
            title: '平台关卡 · 场景',
            meta: '2D 空间 / 材质与层次',
            alt: '2D 平台游戏场景，绿色地下空间'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/tile-room-01.jpg',
            w: 1800,
            h: 1012,
            title: '白色房间 · 光照',
            meta: '室内白盒 / 聚光与投影',
            alt: '白色瓷砖房间场景，聚光灯照向角色'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/tile-room-02.jpg',
            w: 1800,
            h: 1012,
            title: '白色房间 · 构图',
            meta: '室内白盒 / 开口与动线',
            alt: '白色瓷砖房间场景，墙上开口透光'
          },
          {
            kind: 'image',
            span: 6,
            ar: '16 / 9',
            src: 'img/work/p4/elevator-night.gif',
            w: 1280,
            h: 720,
            gif: true,
            title: '夜间电梯 · 动态场景',
            meta: 'GIF 动态 / 灯光与空间引导',
            alt: '夜间电梯厅场景动态影像'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    no: '05',
    file: 'project-5.html',
    title: '课程作品',
    en: 'COURSEWORK',
    kicker: '插画、色彩与角色设计',
    year: '2023 — 2025',
    type: '插画 / 角色设计',
    tools: '手绘 · Photoshop · Illustrator',
    count: '05',
    cover: 'img/work/p5/illustration-crowd.jpg',
    coverW: 1800,
    coverH: 1298,
    coverAlt: '黑白插画，人群围观中央的机械装置',
    lead: 'img/work/p5/illustration-crowd.jpg',
    leadW: 1800,
    leadH: 1298,
    leadCaption: '插画 · 人群与装置 / 手绘',
    intro:
      '课程训练留下的手迹：人体与角色速写、色彩构成、插画叙事与角色三视图。它们不追求完成度，而是记录观察、拆解与试错的过程。',
    statement: '先看清楚，再画下来；先画下来，再决定要不要像。',
    tags: ['插画', '色彩构成', '角色三视图'],
    blocks: [
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 7,
            ar: '4 / 3',
            src: 'img/work/p5/illustration-crowd.jpg',
            w: 1800,
            h: 1298,
            title: '人群与装置',
            meta: '黑白插画 / 叙事与构图',
            alt: '黑白人群插画，中央是机械装置'
          },
          {
            kind: 'image',
            span: 5,
            ar: '22 / 25',
            src: 'img/work/p5/color-study.jpg',
            w: 1591,
            h: 1800,
            title: '色彩构成',
            meta: '色卡提取 / 几何分割',
            alt: '抽象几何色彩构成与色卡'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '1 / 1',
            src: 'img/work/p5/head-studies.jpg',
            w: 1200,
            h: 1200,
            title: '头部练习',
            meta: '九宫格 / 结构拆解',
            alt: '九宫格头部结构素描练习'
          },
          {
            kind: 'note',
            span: 6,
            eyebrow: 'COURSEWORK / 05',
            title: '观察，拆解，再重构',
            body:
              '课程作业更像一组练习曲：用最快的速度抓住结构，再慢慢把表情、体积和颜色放回去。',
            tags: ['速写', '结构', '色彩']
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 6,
            ar: '3 / 4',
            src: 'img/work/p5/line-figure.jpg',
            w: 1273,
            h: 1800,
            title: '线与形',
            meta: '极简线稿 / 留白练习',
            alt: '极简线条人物与地面线稿'
          },
          {
            kind: 'image',
            span: 6,
            ar: '3 / 4',
            src: 'img/work/p5/character-turnaround.jpg',
            w: 1273,
            h: 1800,
            title: '角色三视图',
            meta: '角色设计 / 头部与体块',
            alt: '角色三视图与头部结构草图'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    no: '06',
    file: 'project-6.html',
    title: '其他视觉美术',
    en: 'VISUAL EXPERIMENTS',
    kicker: '像素、字体与循环动画',
    year: '2023 — 2025',
    type: '像素 / 字体 / 动效',
    tools: 'Photoshop · Aseprite',
    count: '08',
    cover: 'img/work/p6/pixel-poster.jpg',
    coverW: 1800,
    coverH: 1348,
    coverAlt: '像素风游戏海报，OUTER WILDS 字样与角色',
    lead: 'img/work/p6/pixel-forest.jpg',
    leadW: 1800,
    leadH: 1011,
    leadCaption: '像素森林 · 场景练习 / Aseprite',
    intro:
      '一些不被归类的尝试：像素场景与界面、字体排版练习，以及两只小狗的循环动画。它们更像一本视觉日记，记录随手玩出来的形状与节奏。',
    statement: '没有 brief 的时候，玩就是最好的 brief。',
    tags: ['像素艺术', '字体排版', '循环动画'],
    blocks: [
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 7,
            ar: '16 / 9',
            src: 'img/work/p6/pixel-forest.jpg',
            w: 1800,
            h: 1011,
            title: '像素森林',
            meta: '场景练习 / 层叠与空气感',
            alt: '像素风森林场景，角色在树间攀爬'
          },
          {
            kind: 'image',
            span: 5,
            ar: '4 / 3',
            src: 'img/work/p6/pixel-poster.jpg',
            w: 1800,
            h: 1348,
            title: 'OUTER WILDS · 海报',
            meta: '像素海报 / 标题与界面',
            alt: '像素风 OUTER WILDS 海报与角色'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 4,
            ar: '3 / 4',
            src: 'img/work/p6/typography-01.jpg',
            w: 854,
            h: 1212,
            title: '字体练习 · 横排',
            meta: '字距 / 版面节奏',
            alt: '中文文字排版练习，横向排列'
          },
          {
            kind: 'image',
            span: 4,
            ar: '3 / 4',
            src: 'img/work/p6/typography-02.jpg',
            w: 854,
            h: 1212,
            title: '字体练习 · 竖排',
            meta: '竖排 / 留白',
            alt: '中文文字竖排排版练习'
          },
          {
            kind: 'image',
            span: 4,
            ar: '3 / 4',
            src: 'img/work/p6/typography-03.jpg',
            w: 854,
            h: 1212,
            title: '字体练习 · 居中',
            meta: '字号 / 灰度层次',
            alt: '中文文字居中排版练习'
          }
        ]
      },
      {
        type: 'row',
        items: [
          {
            kind: 'image',
            span: 4,
            ar: '1 / 1',
            src: 'img/work/p6/dog-run.gif',
            w: 560,
            h: 511,
            gif: true,
            title: '奔跑的小狗',
            meta: 'GIF 循环 / 逐帧',
            alt: '橙色小狗奔跑的循环动画'
          },
          {
            kind: 'image',
            span: 4,
            ar: '1 / 1',
            src: 'img/work/p6/dog-sit.gif',
            w: 560,
            h: 511,
            gif: true,
            title: '坐着的小狗',
            meta: 'GIF 循环 / 表情',
            alt: '橙色小狗坐着的循环动画'
          },
          {
            kind: 'image',
            span: 4,
            ar: '1 / 1',
            src: 'img/work/p6/pixel-inventory.gif',
            w: 1550,
            h: 1550,
            gif: true,
            title: '像素背包 · 界面',
            meta: 'GIF 动态 / 道具与图标',
            alt: '像素风背包界面动图，包含道具图标'
          }
        ]
      }
    ]
  }
];
