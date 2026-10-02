import { RATING_SCALE, formatAverage, type EvaluationSummary, type QuestionSummary } from "@/lib/evaluation";

const RATING_COLORS: Record<(typeof RATING_SCALE)[number], string> = {
  1: "bg-rose-400",
  2: "bg-amber-300",
  3: "bg-[#2aadb5]/60",
  4: "bg-[#1a2e5a]",
};

function DistributionBar({ question }: { question: QuestionSummary }) {
  if (question.responses === 0) {
    return <div className="h-2.5 w-full rounded-full bg-slate-100" />;
  }

  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      {RATING_SCALE.map((rating) => {
        const count = question.distribution[rating];

        return count > 0 ? (
          <div
            key={rating}
            className={RATING_COLORS[rating]}
            style={{ width: `${(count / question.responses) * 100}%` }}
            title={`${rating}: ${count} response${count === 1 ? "" : "s"}`}
          />
        ) : null;
      })}
    </div>
  );
}

export default function EvaluationSummaryView({ summary }: { summary: EvaluationSummary }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#1a2e5a]">Summary</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {RATING_SCALE.map((rating) => (
            <span key={rating} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${RATING_COLORS[rating]}`} />
              {rating}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {summary.sections.map((section) => (
          <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h3 className="font-semibold text-[#1a2e5a]">{section.title}</h3>
              <span className="text-sm font-semibold text-[#2aadb5]">avg {formatAverage(section.average)}</span>
            </div>
            <ul className="space-y-3">
              {section.questions.map((question) => (
                <li key={question.id} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-slate-600">
                      {question.id.slice(1)}. {question.text}
                    </span>
                    <span className="shrink-0 font-semibold text-[#1a2e5a]">{formatAverage(question.average)}</span>
                  </div>
                  <DistributionBar question={question} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
