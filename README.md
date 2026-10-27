# 李家起 · 个人作品集 / LMJB Portfolio

一个以「画册红」为视觉线索的个人作品集网站。浅纸色、细红框、编号与中英双语编辑排版，收录平面设计、游戏策划、非线性编辑、场景美术、课程作品与其他视觉实验六组内容。

## 快速预览

直接双击 `index.html` 即可浏览；也可以在当前目录启动一个静态服务器：

```bash
python -m http.server 8080
# 然后访问 http://localhost:8080
```

页面支持浅色 / 深色主题切换（右上角圆形按钮）。首次访问默认为浅色纸面风格，手动切换后会记住选择。也可以用 `?theme=light` 或 `?theme=dark` 强制预览指定主题。

## 最近更新（V2）

- `project-4` / `project-5` / `project-6` 已同步 `project-1/2/3` 的详情页悬停效果：卡片上浮、图片放大、图注元信息渐显。
- 深浅色切换增加了约 0.5s 的淡入淡出（支持 View Transitions 的浏览器使用整页交叉淡化，其余浏览器回退为颜色过渡）。
- 首页、作品页、详情页与联系页增加了细线圆环、菱形、十字准星、章节角标等几何装饰，保持低对比、不干扰阅读。
- 页面最下方加入可替换底图 `img/bottom-map.png`，位于页脚版权信息之下，带深色渐变、准星与角落标记。

## 页面结构

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：主视觉、精选作品、关于、教育背景、奖项、联系方式 |
| `projects.html` | 六组作品的索引页 |
| `project-1.html` … `project-6.html` | 六个独立作品详情页，含完整图片、图注与灯箱 |
| `contacts.html` | 联系方式、所在地、合作状态 |
| `project-page.html` | 旧入口，自动跳转到作品索引 |

## 目录

```text
portfolio-for-everyone-main/
├─ css/
│  ├─ main.css          # 全站视觉、响应式、深浅主题
│  └─ reset.css
├─ js/
│  └─ main.js           # 主题、滚动进度、移动端菜单、入场动画、灯箱
├─ img/
│  ├─ work/p1…p6/       # 由「个人作品素材」整理后的作品图
│  ├─ bottom-map.png     # 页面最下方底图（直接替换同名文件即可）
│  ├─ icons/            # 社交图标
│  └─ favicon.svg
├─ tools/
│  ├─ prepare-images.ps1 # 素材 → 网页图片（最长边 1800px，GIF 保留动画）
│  ├─ site-data.mjs      # 所有项目文案、图片顺序、版式分组
│  ├─ build.mjs          # 静态页面生成器
│  ├─ capture.mjs        # 基于 Edge CDP 的截图工具（开发用）
│  └─ check.mjs          # 页面质量与交互检查（开发用）
└─ *.html
```

## 修改内容

> 当前页面是「手工微调版」：`index.html`、`projects.html`、`project-1…3.html` 内含卡片悬停的内联样式与脚本，所有页面页脚内都插入了底部底图。直接运行 `node tools/build.mjs` 会用旧模板重新生成 HTML，**覆盖这些微调**。如需重建，请先把内联样式/脚本和底图块合并进生成器。

1. 文案、图片顺序、图注、项目元信息都集中在 `tools/site-data.mjs`。
2. 直接编辑对应 HTML 中的文字；或改 `tools/site-data.mjs` 后手动同步（不要直接重建，原因见上）。
3. 替换作品图片：把新图放进 `img/work/pN/`，再修改对应 `project-N.html` 中的 `src`、`width`、`height`。

## 替换底部底图

页面最下方（页脚版权行之后）的底图统一引用：

```text
img/bottom-map.png
```

直接用同名、同尺寸比例的图片覆盖即可，无需改代码。当前图片为 1535 × 703（约 2.18:1），桌面端以 `object-fit: cover` 裁切为横幅，移动端显示高度更小；如想完整显示整张图，可在 `css/main.css` 的 `.baseplate` / `.baseplate img` 中调整 `height` 与 `object-fit`。

## 图片整理

原始素材位于 `../个人作品素材/` 的六个文件夹中。`tools/prepare-images.ps1` 会：

- 将栅格图最长边压缩到 1800px，输出 JPEG（质量 88）；
- 带透明通道的图保留 PNG；
- GIF 原样复制，保留动画；
- 用语义化英文文件名归入 `img/work/p1…p6/`。

> 6 个 GIF 体积较大（合计约 39MB），已使用 `loading="lazy"` 延迟加载。若之后要部署到公网，建议把大 GIF 转成 MP4 / WebM，或另做点击播放。

## 设计说明

- 参考 `作品集v3.pptx` 的画册式版式：`#d71919` 画册红、浅灰纸面、细红框、红色方块、点阵、章节编号与中英双语标题。
- 标题使用本机的 Noto Serif SC / Garamond，正文使用 Noto Sans SC，不依赖外部字体服务。
- 详情页采用 12 栏编辑网格：横图、竖图、整幅大图与特殊「主视觉 + 红底文字」模块交错排列；所有图片在灯箱中可按原始比例查看。
- 详情页作品卡统一采用悬停浮起、图片缩放、图注元信息渐显的交互。
- 深浅主题通过 View Transitions 交叉淡化；若浏览器不支持，则回退为背景与文字颜色的平滑过渡。
- 深色模式与浅色模式共用同一套排版，只替换纸面、墨色与强调色。
- 社交链接目前是占位（`#!`），可在 `tools/site-data.mjs` 的 `SITE.socials` 中替换成真实地址。

## 原始模板

基于 [PortfolioForEveryone](https://github.com/BAINDA/portfolio-for-everyone)（MIT License）的结构改造，保留原项目的 `LICENSE` 与社交图标素材。页面结构、视觉系统、图片整理与交互均为本项目重新实现。

© 2026 李家起 · LMJB
