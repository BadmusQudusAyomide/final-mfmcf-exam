import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const examJsPath = path.join(repoRoot, "exam.js");
const outputPath = path.join(repoRoot, "src", "data", "legacy-questions.json");

const examSource = fs.readFileSync(examJsPath, "utf8");
const start = examSource.indexOf("const questions = [");
const end = examSource.indexOf("const questionsPerPage");

if (start === -1 || end === -1 || end <= start) {
  throw new Error("Unable to locate the legacy question array in exam.js.");
}

const questionBlock = examSource.slice(start, end).replace("const questions =", "questions =");
const context = { questions: [] };

vm.createContext(context);
vm.runInContext(questionBlock, context);

const normalizedQuestions = context.questions.map((question, index) => ({
  id: `legacy-q-${index + 1}`,
  order: index + 1,
  prompt: String(question.question ?? "").trim(),
  explanation: String(question.explanation ?? "")
    .replaceAll("â€™", "'")
    .replaceAll("â€“", "-")
    .replaceAll("Â·", "·")
    .trim(),
  options: Array.isArray(question.options)
    ? question.options.map((option, optionIndex) => ({
        label: String(option).replaceAll("â€™", "'").replaceAll("â€“", "-").trim(),
        isCorrect: String(option).trim() === String(question.answer).trim(),
        order: optionIndex + 1,
      }))
    : [],
}));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(normalizedQuestions, null, 2)}\n`, "utf8");

console.log(`Extracted ${normalizedQuestions.length} questions to ${path.relative(repoRoot, outputPath)}.`);
