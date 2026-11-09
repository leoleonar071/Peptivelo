import { FlaskConical, ScanLine, BookOpen } from "lucide-react";

const contexts = [
  {
    title: "Cosmetic use",
    Icon: ScanLine,
    question: "What does the label tell you?",
    description:
      "Distinguish ingredient research from evidence for the finished product.",
  },
  {
    title: "Medicines",
    Icon: BookOpen,
    question: "Approved for which use?",
    description:
      "Check the indication and jurisdiction. Approval is specific to a medicine and its use.",
  },
  {
    title: "Experimental research",
    Icon: FlaskConical,
    question: "What has actually been studied?",
    description:
      "Read the study setting and limitations. Experimental findings do not establish clinical benefit.",
  },
];

export function PeptideContexts() {
  return (
    <div className="peptide-contexts">
      <p className="context-caption">THREE CONTEXTS. DIFFERENT QUESTIONS.</p>
      <ol className="context-list">
        {contexts.map(({ title, Icon, question, description }, index) => (
          <li key={title}>
            <div className="context-symbol" aria-hidden="true">
              <Icon size={24} strokeWidth={1.5} />
              <span>0{index + 1}</span>
            </div>
            <div>
              <h3>{title}</h3>
              <p className="context-question">{question}</p>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="context-footnote">
        Contexts of use, not mutually exclusive molecular families.
      </p>
    </div>
  );
}
