const $ = (id) => document.getElementById(id);

const subjectSel = $("subjectSel");
const countSel = $("countSel");
const startBtn = $("startBtn");
const shuffleBtn = $("shuffleBtn");

const setupView = $("setupView");
const quizView = $("quizView");
const resultsView = $("resultsView");

const statusPill = $("statusPill");
const scorePill = $("scorePill");
const progressBar = $("progressBar");
const metaLine = $("metaLine");
const questionText = $("questionText");
const answersBox = $("answersBox");
const answerForm = $("answerForm");
const feedbackBox = $("feedbackBox");

const checkBtn = $("checkBtn");
const nextBtn = $("nextBtn");
const flagBtn = $("flagBtn");
const quitBtn = $("quitBtn");

const resultsSummary = $("resultsSummary");
const reviewBox = $("reviewBox");
const restartBtn = $("restartBtn");

const FILES = [
  "questions/maths.json",
  "questions/english-language.json",
  "questions/biology.json",
  "questions/physics.json"
];

let bank = [];
let quiz = {
  items: [],
  index: 0,
  score: 0,
  checked: false,
  flags: new Set(),
  responses: []
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a,b) => a.localeCompare(b));
}

async function loadBank() {
  const parts = [];
  const problems = [];

  for (const p of FILES) {
    try {
      const r = await fetch(p, { cache: "no-store" });
      if (!r.ok) {
        problems.push(`${p} → HTTP ${r.status}`);
        continue;
      }

      const text = await r.text();
      if (!text.trim()) {
        problems.push(`${p} → empty file`);
        continue;
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        problems.push(`${p} → invalid JSON (${e.message})`);
        continue;
      }

      if (!Array.isArray(json)) {
        problems.push(`${p} → JSON is not an array`);
        continue;
      }

      parts.push(json);
    } catch (e) {
      problems.push(`${p} → fetch error (${e.message})`);
    }
  }

  return { bank: parts.flat(), problems };
}

function buildSubjectSelector() {
  const subjects = uniqueSorted(bank.map(q => q.subject));
  subjectSel.innerHTML = subjects.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
}

function startQuiz() {
  const subject = subjectSel.value;
  const pool = bank.filter(q => q.subject === subject);

  const desired = Math.max(1, parseInt(countSel.value, 10) || 10);
  const count = Math.min(desired, pool.length);

  const items = shuffleInPlace([...pool]).slice(0, count);

  quiz = {
    items,
    index: 0,
    score: 0,
    checked: false,
    flags: new Set(),
    responses: []
  };

  setupView.classList.add("hidden");
  resultsView.classList.add("hidden");
  quizView.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  const q = quiz.items[quiz.index];
  quiz.checked = false;

  feedbackBox.classList.add("hidden");
  feedbackBox.textContent = "";
  feedbackBox.classList.remove("ok", "bad");

  nextBtn.disabled = true;
  checkBtn.disabled = false;

  const qNo = quiz.index + 1;
  const total = quiz.items.length;

  statusPill.textContent = `Q ${qNo} / ${total}`;
  scorePill.textContent = `Score: ${quiz.score}`;
  progressBar.style.width = `${Math.round((quiz.index / total) * 100)}%`;

  metaLine.innerHTML = `
    <span class="tag">${escapeHtml(q.subject)}</span>
    <span class="tag">${escapeHtml(q.topic)}</span>
    <span class="tag">${escapeHtml(q.examBoard || "Edexcel")}</span>
    ${quiz.flags.has(quiz.index) ? `<span class="tag flag">Flagged</span>` : ""}
  `;

  questionText.textContent = q.q;

  answersBox.innerHTML = q.choices.map((c, i) => `
    <label class="answer">
      <input type="radio" name="choice" value="${i}" />
      <div>${escapeHtml(c)}</div>
    </label>
  `).join("");
}

function getChosenIndex() {
  const el = answerForm.querySelector('input[name="choice"]:checked');
  return el ? parseInt(el.value, 10) : null;
}

function checkAnswer(evt) {
  evt.preventDefault();
  if (quiz.checked) return;

  const q = quiz.items[quiz.index];
  const chosen = getChosenIndex();

  if (chosen === null) {
    feedbackBox.classList.remove("hidden");
    feedbackBox.classList.add("bad");
    feedbackBox.textContent = "Pick an answer first.";
    return;
  }

  const correct = chosen === q.answerIndex;
  quiz.checked = true;
  if (correct) quiz.score += 1;

  quiz.responses.push({ chosenIndex: chosen, correct, question: q });

  feedbackBox.classList.remove("hidden");
  feedbackBox.classList.toggle("ok", correct);
  feedbackBox.classList.toggle("bad", !correct);

  const correctText = q.choices[q.answerIndex];
  feedbackBox.innerHTML = `
    <div style="font-weight:800; margin-bottom:6px;">
      ${correct ? "✅ Correct" : "❌ Not quite"}
    </div>
    ${!correct ? `<div class="hint">Correct answer: <b>${escapeHtml(correctText)}</b></div>` : ""}
    ${q.explanation ? `<div class="hint" style="margin-top:8px;">${escapeHtml(q.explanation)}</div>` : ""}
  `;

  nextBtn.disabled = false;
  checkBtn.disabled = true;

  const qNo = quiz.index + 1;
  const total = quiz.items.length;
  progressBar.style.width = `${Math.round((qNo / total) * 100)}%`;
}

function nextQuestion() {
  if (!quiz.checked) return;
  if (quiz.index < quiz.items.length - 1) {
    quiz.index += 1;
    renderQuestion();
  } else {
    showResults(false);
  }
}

function toggleFlag() {
  if (quiz.flags.has(quiz.index)) quiz.flags.delete(quiz.index);
  else quiz.flags.add(quiz.index);
  renderQuestion();
}

function quitQuiz() {
  showResults(true);
}

function showResults(isQuit) {
  quizView.classList.add("hidden");
  resultsView.classList.remove("hidden");

  const total = quiz.items.length;
  const score = quiz.score;
  const percent = total ? Math.round((score / total) * 100) : 0;

  resultsSummary.textContent =
    `${isQuit ? "Quiz ended early. " : ""}You scored ${score} / ${total} (${percent}%). ` +
    `${quiz.flags.size ? `Flagged: ${quiz.flags.size}.` : ""}`;

  reviewBox.innerHTML = "";
  quiz.responses.forEach((r, idx) => {
    const q = r.question;
    const flagged = quiz.flags.has(idx);
    const chosenText = q.choices[r.chosenIndex] ?? "(no answer)";
    const correctText = q.choices[q.answerIndex];

    const tags = [
      flagged ? `<span class="tag flag">Flagged</span>` : "",
      r.correct ? `<span class="tag right">Correct</span>` : `<span class="tag wrong">Wrong</span>`
    ].join(" ");

    const div = document.createElement("div");
    div.className = "review-item";
    div.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <div style="font-weight:800;">Q${idx + 1}. ${escapeHtml(q.q)}</div>
        <div>${tags}</div>
      </div>
      <div class="hint" style="margin-top:6px;">
        Your answer: <b>${escapeHtml(chosenText)}</b><br/>
        Correct: <b>${escapeHtml(correctText)}</b>
      </div>
      ${q.explanation ? `<div class="hint" style="margin-top:6px;">${escapeHtml(q.explanation)}</div>` : ""}
      <div class="hint" style="margin-top:6px;">
        <span class="tag">${escapeHtml(q.subject)}</span>
        <span class="tag">${escapeHtml(q.topic)}</span>
        <span class="tag">${escapeHtml(q.examBoard || "Edexcel")}</span>
      </div>
    `;
    reviewBox.appendChild(div);
  });

  if (quiz.responses.length === 0) {
    reviewBox.innerHTML = `<p class="hint">No answers recorded yet.</p>`;
  }
}

function restart() {
  resultsView.classList.add("hidden");
  quizView.classList.add("hidden");
  setupView.classList.remove("hidden");
}

startBtn.addEventListener("click", startQuiz);
shuffleBtn.addEventListener("click", () => {
  bank = shuffleInPlace(bank);
  buildSubjectSelector();
  alert("Shuffled the question bank (order only).");
});

answerForm.addEventListener("submit", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
flagBtn.addEventListener("click", toggleFlag);
quitBtn.addEventListener("click", quitQuiz);
restartBtn.addEventListener("click", restart);

(async () => {
  const result = await loadBank();
  bank = result.bank;

  if (result.problems.length) {
    const msg = document.createElement("div");
    msg.style.border = "1px solid #fecaca";
    msg.style.background = "#fef2f2";
    msg.style.padding = "10px 12px";
    msg.style.borderRadius = "12px";
    msg.style.marginBottom = "12px";
    msg.style.color = "#991b1b";
    msg.innerHTML = `<b>Question bank load issues:</b><br>${result.problems.map(x => `• ${x}`).join("<br>")}`;
    document.getElementById("setupView").prepend(msg);
  }

  if (!bank.length) {
    const msg = document.createElement("div");
    msg.style.border = "1px solid #fde68a";
    msg.style.background = "#fffbeb";
    msg.style.padding = "10px 12px";
    msg.style.borderRadius = "12px";
    msg.style.marginBottom = "12px";
    msg.style.color = "#92400e";
    msg.innerHTML = `<b>No questions loaded.</b> Check your JSON files in /questions/.`;
    document.getElementById("setupView").prepend(msg);
    return;
  }

  buildSubjectSelector();
})();
