import type { EvaluationStatus } from "@/lib/evaluation";

function formatCutoff(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "Asia/Manila" }).format(
    new Date(isoDate),
  );
}

export default function EvaluationShell({
  status,
  banner,
  children,
}: {
  status: EvaluationStatus;
  banner?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_45%,#f8fbff_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Evaluation</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">2nd CM-CMMC Evaluation Form</h1>
        </div>

        <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm">
          <p>
            Thank you for being part of the 2nd Cebu Metropolitan Catholic Mass Media Congress (CM-CMMC). We
            hope this gathering has inspired you to use media and technology responsibly, always upholding the
            dignity of every person and advancing the mission of the Church.
          </p>
          <p>
            Please accomplish this evaluation form to help us assess the Congress and improve future formation
            programs. Your honest feedback will guide us in enhancing your experience in our future events.
          </p>
          <p>
            <span className="font-semibold text-slate-800">
              To receive your Certificate of Participation, you must have registered for Day 1 and Day 2
              sessions of the Congress and completed this evaluation form.
            </span>{" "}
            Certificates can be requested until {formatCutoff(status.closesAt)}.
          </p>
          <p>
            By submitting this form, you consent to the collection, use, and processing of your personal
            information solely for purposes related to the Cebu Metropolitan Catholic Mass Media Congress, in
            accordance with the Data Privacy Act of 2012. All information provided will be treated with
            confidentiality and will only be accessed by the Cebu Archdiocesan Digital Communications Ministry
            (CADComM) volunteers involved in the administration and organization of the event.
          </p>
        </section>

        {banner}

        {status.isAcceptingResponses ? (
          children
        ) : (
          <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">
            The evaluation form is currently closed. Please check back later.
          </p>
        )}
      </div>
    </main>
  );
}
