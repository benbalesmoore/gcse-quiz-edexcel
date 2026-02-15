:root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
body { margin: 0; background: #f6f7fb; color: #111; }
.header { background: #111827; color: #fff; padding: 18px 0; }
.wrap { max-width: 980px; margin: 0 auto; padding: 0 16px; }
.header h1 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
.header p { margin: 0; opacity: .85; font-size: 13px; }
.grid { display: grid; gap: 14px; grid-template-columns: 1fr; padding: 16px; }
@media (min-width: 900px) { .grid { grid-template-columns: 1.3fr .7fr; } }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.05); padding: 16px; }
.controls { display: grid; gap: 12px; }
label { font-size: 12px; color: #374151; display: block; margin-bottom: 6px; }
select, input[type="number"] { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; font-size: 14px; }
button { border: 0; border-radius: 12px; padding: 10px 12px; font-size: 14px; cursor: pointer; background: #111827; color: #fff; }
button.secondary { background: #eef2ff; color: #111827; border: 1px solid #c7d2fe; }
button.ghost { background: transparent; color: #111827; border: 1px solid #d1d5db; }
button:disabled { opacity: .5; cursor: not-allowed; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.pill { font-size: 12px; padding: 6px 10px; border-radius: 999px; background: #f3f4f6; border: 1px solid #e5e7eb; }
.progress { height: 10px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-bottom: 10px; }
.progress > div { height: 100%; width: 0%; background: #22c55e; transition: width .2s ease; }
.meta { font-size: 12px; color: #6b7280; margin-bottom: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.qtitle { font-size: 16px; font-weight: 800; margin: 4px 0 10px; }
.answers { display: grid; gap: 10px; margin-top: 10px; }
.answer { border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px 12px; background: #fff; display: flex; gap: 10px; align-items: flex-start; }
.answer input { margin-top: 3px; }
.feedback { margin-top: 12px; padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb; background: #f9fafb; }
.feedback.ok { border-color: #86efac; background: #f0fdf4; }
.feedback.bad { border-color: #fecaca; background: #fef2f2; }
.hidden { display: none; }
.hint { font-size: 12px; color: #6b7280; line-height: 1.5; margin-top: 6px; }
.side ul { margin: 0; padding-left: 18px; line-height: 1.7; font-size: 13px; color: #374151; }
hr { border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0; }
.review-item { border-top: 1px dashed #e5e7eb; padding-top: 10px; margin-top: 10px; }
.tag { font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px solid #e5e7eb; background: #f9fafb; }
.tag.flag { border-color: #fde68a; background: #fffbeb; }
.tag.wrong { border-color: #fecaca; background: #fef2f2; }
.tag.right { border-color: #86efac; background: #f0fdf4; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; }
