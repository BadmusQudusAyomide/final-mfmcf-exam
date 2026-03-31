import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const questionsPath = path.join(repoRoot, "src", "data", "current-year-questions.json");

const existing = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

const prefixQuestions = [
  {
    id: "current-salvation-1",
    order: 1,
    prompt:
      "A believer says, \"I was saved last week, so now I am free from the presence of sin.\" Based on the definition of salvation in the manual, which correction is most accurate?",
    explanation:
      "The manual explicitly states that at salvation a believer is delivered from the power, pollution, and penalty of sin.",
    options: [
      { label: "You are free only from the guilt of sin, not its presence.", isCorrect: false, order: 1 },
      { label: "Salvation delivers you from the power, pollution, and penalty of sin-all three.", isCorrect: true, order: 2 },
      { label: "You will be delivered from the pollution of sin only after death.", isCorrect: false, order: 3 },
      { label: "Salvation only covers past sins, not the nature of sin.", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-salvation-2",
    order: 2,
    prompt: "According to the study text, what was transferred at the fall?",
    explanation: "John 8:44 is cited in the manual: fatherhood was transferred to the devil.",
    options: [
      { label: "Dominion over the earth", isCorrect: false, order: 1 },
      { label: "Fatherhood to the devil", isCorrect: true, order: 2 },
      { label: "The law of Moses", isCorrect: false, order: 3 },
      { label: "The ability to hear God", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-salvation-3",
    order: 3,
    prompt:
      "Which of the following was not part of God's redemption plan as outlined in the manual?",
    explanation:
      "The manual says God sent man out of the garden so he would not live forever in a fallen state by eating from the tree of life.",
    options: [
      { label: "Giving the law through Moses", isCorrect: false, order: 1 },
      { label: "Ordaining blood of bulls and goats", isCorrect: false, order: 2 },
      { label: "Sending prophets to teach the law", isCorrect: false, order: 3 },
      { label: "Allowing man to eat from the tree of life", isCorrect: true, order: 4 },
    ],
  },
  {
    id: "current-salvation-4",
    order: 4,
    prompt: "The manual states that the \"only way to the Father\" became available through:",
    explanation:
      "The text says Jesus, through the sacrifice of God's only begotten Son, became the only way to the Father.",
    options: [
      { label: "Keeping the Ten Commandments", isCorrect: false, order: 1 },
      { label: "The blood of bulls and goats", isCorrect: false, order: 2 },
      { label: "The sacrifice of God's only begotten Son", isCorrect: true, order: 3 },
      { label: "Water baptism", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-salvation-5",
    order: 5,
    prompt:
      "Which blessing of redemption is described as being \"recreated\" and having the Holy Spirit come to \"abide therein\"?",
    explanation:
      "The manual says the believer's spirit was recreated by the Holy Spirit and He came to abide therein.",
    options: [
      { label: "Our body", isCorrect: false, order: 1 },
      { label: "Our soul", isCorrect: false, order: 2 },
      { label: "Our spirit", isCorrect: true, order: 3 },
      { label: "Our conscience", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-sanctification-1",
    order: 6,
    prompt:
      "A person prays, \"Lord, sanctify me! Make me holy!\" According to the conclusion of the Sanctification chapter, how should you counsel them?",
    explanation:
      "The manual says believers are not begging or praying for sanctification; they are thanking God because He has already done it in Christ.",
    options: [
      { label: "Continue praying earnestly; sanctification is a lifelong process.", isCorrect: false, order: 1 },
      { label: "Stop praying for it; thank God it is already done in Christ.", isCorrect: true, order: 2 },
      { label: "Pray for both purification and separation as two separate steps.", isCorrect: false, order: 3 },
      { label: "Only pastors can be sanctified; you must wait for ordination.", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-sanctification-2",
    order: 7,
    prompt: "Which statement best reflects the relationship between purification and separation?",
    explanation:
      "The manual teaches that God first purifies at salvation and then separates unto Himself, both encompassed in sanctification already accomplished in Christ.",
    options: [
      { label: "Separation comes first, then purification follows.", isCorrect: false, order: 1 },
      { label: "Purification and separation happen simultaneously at salvation.", isCorrect: true, order: 2 },
      { label: "God separates dirty vessels to Himself and then purifies them.", isCorrect: false, order: 3 },
      { label: "Purification happens at salvation; separation is a later step.", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-sanctification-3",
    order: 8,
    prompt:
      "The shortcomings of Old Testament purification included all of the following except:",
    explanation:
      "Hebrews 10:4 says the blood of bulls and goats could not take away sins, so the statement that it could take away sins but not guilt is the exception.",
    options: [
      { label: "It could not make the comers perfect.", isCorrect: false, order: 1 },
      { label: "It had to be done year after year.", isCorrect: false, order: 2 },
      { label: "It could take away sins but not the guilt.", isCorrect: true, order: 3 },
      { label: "It only brought remembrance of sins.", isCorrect: false, order: 4 },
    ],
  },
  {
    id: "current-sanctification-4",
    order: 9,
    prompt: "According to Hebrews 10:10, sanctification was accomplished:",
    explanation:
      "The memory verse states sanctification came through the offering of the body of Jesus Christ once for all.",
    options: [
      { label: "Through the blood of bulls and goats", isCorrect: false, order: 1 },
      { label: "Through the offering of the body of Jesus Christ once for all", isCorrect: true, order: 2 },
      { label: "By keeping the law perfectly", isCorrect: false, order: 3 },
      { label: "By being baptized in water", isCorrect: false, order: 4 },
    ],
  },
];

const shifted = existing.map((question, index) => ({
  ...question,
  order: index + prefixQuestions.length + 1,
}));

const combined = [...prefixQuestions, ...shifted];

fs.writeFileSync(questionsPath, `${JSON.stringify(combined, null, 2)}\n`, "utf8");

console.log(`Rebuilt current-year questions file with ${combined.length} total questions.`);
