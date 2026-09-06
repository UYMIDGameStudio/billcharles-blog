# 网站代码审计与升级记录

日期：2026-09-06。对象：本地工作区 D:/billcharles-blog-main 的当前版本。

已完成站点自有代码审查，并根据后续授权直接修复确认的问题。最终静态检查、类型检查、65 项单元及内容测试、生产构建、23 个页面和 20 张分享图片的生产回归均通过；npm 全量依赖审计报告 0 个已知漏洞。以上为审计完成时的本地验证记录；Git 推送前复核见文末。

## 审查范围

覆盖 app 下全部页面、组件、元数据与图片路由，lib 下内容加载、分类、站点资料、出版记录、分享图片工具，以及 proxy、Next.js/TypeScript/CSS/ESLint 配置、依赖锁文件、脚本、测试和 GitHub Actions。检查 Markdown 元数据、内部文章链接与出版记录的一致性。未将 node_modules 第三方源码逐行审计；第三方依赖采用锁文件漏洞审计，并查阅相关 Next.js 实现与本地版本文档。构建产物、IDE 缓存、Git 历史和文章学术论证不属于本次代码审查范围。

基线工作区已有 4 篇文章删除，以及未跟踪的文章副本、旧页面副本和 KofiWidget 等文件；本次没有恢复、删除或覆盖这些用户原有变更。KofiWidget 当前未被页面导入，实际打赏入口是普通外链。

## 确认问题与处理结果

P2 表示需要修复的功能或维护问题；P3 表示较低优先级的体验问题。依赖公告的 High 是供应链公告评级，不代表已确认本网站存在可远程利用的高危入口。

| 级别 | 问题及证据 | 修复 | 代码位置 |
| --- | --- | --- | --- |
| P2 | /notes/%、/topics/% 在生产预览返回 500，原有保护只覆盖 articles | 统一校验三个内容空间，畸形路径返回 404；增加单元及真实 HTTP 回归 | [proxy.ts](D:/billcharles-blog-main/proxy.ts:4) |
| P2 | 深色主题下笔记详情仍使用固定深色文字，正文与背景接近 | 笔记列表与详情改用主题颜色，正文复用通用 Markdown 样式，补充内容语言属性 | [app/notes/[slug]/page.tsx](D:/billcharles-blog-main/app/notes/[slug]/page.tsx:126) |
| P2 | 320px 下导航使页面宽度变成 344px；文章日期栏、长 DOI 链接及对照表也产生溢出，部分页面达 411px | 缩小窄屏导航间距，日期栏允许换行，联系信息网格可收缩，长链接可断行，表格在容器内横向滚动 | [app/components/SiteHeader.tsx](D:/billcharles-blog-main/app/components/SiteHeader.tsx:38); [app/components/MarkdownContent.tsx](D:/billcharles-blog-main/app/components/MarkdownContent.tsx:42) |
| P2 | 笔记、专题和 About 等页面的 twitter:title 实际输出首页名称 BillCharles Blog | 取消根布局固定分享文字，让页面 Open Graph 信息供给分享卡片；补充隐私页和站点地图的页面级分享信息 | [app/layout.tsx](D:/billcharles-blog-main/app/layout.tsx:34) |
| P2 | 日期显示依赖运行环境时区，UTC 日期在美国西岸会显示为前一天 | 固定按 UTC 格式化；三个真实子进程分别在 UTC、洛杉矶、上海时区验证日期不变 | [lib/posts.ts](D:/billcharles-blog-main/lib/posts.ts:281) |
| P2（开发依赖） | Browserslist 4.28.6 命中两个 High 公告，经 eslint-config-next → Babel 引入；原 CI 只审计生产依赖，遗漏此问题 | 更新到 4.28.9 及兼容浏览器数据包，CI 改为全依赖审计；全量 audit 为 0 | [package-lock.json](D:/billcharles-blog-main/package-lock.json:3761); [.github/workflows/ci.yml](D:/billcharles-blog-main/.github/workflows/ci.yml:30) |
| P3 | About、Publications、笔记详情等页面覆盖 alternates 后丢失 RSS 自动发现链接 | 所有正常内容页面保留公共 RSS 类型链接，生产回归逐页断言 | [app/notes/[slug]/page.tsx](D:/billcharles-blog-main/app/notes/[slug]/page.tsx:51) |
| P3 | 隐私页同时声明 max-w-2xl 和 max-w-none，实际最大宽度为 none | 去掉冲突样式，恢复阅读栏宽度 | [app/privacy/page.tsx](D:/billcharles-blog-main/app/privacy/page.tsx:24) |

Browserslist 的受影响版本及修补信息来自 [内存增长公告](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) 与 [自定义统计数据处理公告](https://github.com/advisories/GHSA-73wf-gq98-2v4g)。此项目没有向访客开放 Browserslist 查询或自定义统计数据入口。

## 一并完成的升级

- 调整浅色次要文字与深色按钮文字，提高可读性；表格文字和边框支持深色主题。
- 分类按钮提供 aria-pressed 状态，主导航具备可访问名称，滚动表格支持键盘聚焦。
- 尊重系统减少动态效果设置。
- 为固定尺寸头像补充 sizes，避免浏览器按整屏尺寸选择图片。
- 新增内容元数据、有效日期、出版标题与作者一致性、专题 URL 唯一性检查。
- 新增 npm run test:smoke：自动启动本地生产服务，检查 sitemap 全部页面、canonical、RSS、安全响应头、分享标题与 PNG 图片、404 及旧文章重定向，结束后关闭服务。
- 将生产回归接入 npm run check 和 GitHub Actions。README 补充检查步骤及 Node.js 22.18+ 要求。

## 最终验证

| 检查 | 结果 |
| --- | --- |
| ESLint、TypeScript | 通过 |
| 测试 | 7 个文件、65 项通过（原为 5 个文件、29 项） |
| Next.js 生产构建 | 通过，49 项静态生成任务完成 |
| 生产 HTTP 回归 | 23 个页面、20 张分享图片通过；畸形路径和未知内容返回 404；旧文章地址返回 308 |
| 浏览器布局 | 本机无界面 Edge/Chromium，23 个页面 × 320/1440px × 明暗主题，无整页横向溢出、无 pageerror |
| 页面交互 | 分类筛选正确；首页 5 篇文章翻页后阅读链接均在可见区域；深色主题刷新后保持 |
| 依赖 | npm audit 全量 0 个已知漏洞 |

## 边界

结论针对本地当前构建，未验证线上部署配置、生产日志、流量负载、Safari/Firefox 或真实手机触摸行为。当前 JSON-LD 已对脚本闭合字符转义，Markdown 没有启用原始 HTML 执行；源码未发现登录、数据库写入或公开 AI 调用端点。未运行会产生外部模型费用的 AI 演示。分享图片构建仍依赖现有字体获取与回退机制；本次网络可用时全部图片生成成功，未模拟离线字体渲染。

## SSH 推送前提交快照复核

本次提交只包含审计升级、测试和报告，未纳入工作区原有的 4 篇文章删除或未跟踪副本。因此独立检出的提交快照包含 27 个页面和 24 张分享图片。重新安装锁定依赖后，静态检查、类型检查、65 项测试、57 项静态生成任务以及全部生产 HTTP 回归通过，依赖审计为 0。目标为仓库原有分支 codex/publish-who-decides-person；本次推送不合并 main。

## 与 main 的冲突解决

主分支在 PR #25 中已明确移除公开 Notes 栏目。此次合并保留该决定，删除冲突的两个 Notes 页面，并清理内容一致性测试对 getNotes 的引用。新增生产回归验证 Notes 索引、原笔记 URL 和图片返回 404，sitemap 和 llms.txt 不再包含 Notes。其余审计升级与主分支 About 导航和文章更新均保留。合并结果通过 66 项测试、生产构建，以及 23 个页面和 20 张分享图片的 HTTP 回归。
