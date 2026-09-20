const STORAGE_KEY = "chomp-counter-score";
const scoreElement = document.querySelector("#score");
const footerScoreElement = document.querySelector("#footerScore");
const dinoFrame = document.querySelector("#dinoFrame");
const mouthTrigger = document.querySelector("#mouthTrigger");
const burst = document.querySelector("#burst");

let score = Number.parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
let closeTimer;

if (!Number.isFinite(score) || score < 0) {
  score = 0;
}

function renderScore() {
  const formattedScore = new Intl.NumberFormat().format(score);
  scoreElement.textContent = formattedScore;
  footerScoreElement.textContent = formattedScore;
}

function chomp() {
  score += 1;
  localStorage.setItem(STORAGE_KEY, String(score));
  renderScore();

  dinoFrame.classList.remove("is-open");
  burst.classList.remove("is-visible");
  void dinoFrame.offsetWidth;
  dinoFrame.classList.add("is-open");
  burst.classList.add("is-visible");

  clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    dinoFrame.classList.remove("is-open");
  }, 680);

  return { chomps: score, mouth: "open" };
}

mouthTrigger.addEventListener("click", chomp);
renderScore();

const modelContext = document.modelContext;

if (modelContext?.registerTool) {
  try {
    Promise.resolve(
      modelContext.registerTool({
        name: "open_dinosaur_mouth",
        title: "Chomp",
        description: "Open the dinosaur's mouth once and add one to the visible chomp count.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          untrustedContentHint: false,
        },
        execute: chomp,
      }),
    ).catch(() => {});
  } catch {
    // Browsers without WebMCP support still use the visible button normally.
  }
}
