import { SPEAKERS } from "@/lib/speakers";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import SpeakerDetails from "./SpeakerDetails";

function Avatar({
  imgUrl,
  size = "md",
}: {
  imgUrl?: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "size-24" : "size-16";
  return (
    <div
      className={`${dim} rounded-full bg-[#f0941430] border-2 border-[#f09414] flex items-center justify-center shrink-0`}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-[#f09414]"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      )}
    </div>
  );
}

export default function BreakoutSection() {
  const breakoutSpeakers = SPEAKERS.filter((s) =>
    s.session?.startsWith("Breakout Session"),
  );
  return (
    <section className="py-16 bg-white lg:h-screen" id="program">
      <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="flex justify-center mb-12">
          <div className="bg-[#56aeff] text-white text-sm font-bold uppercase tracking-widest px-8 py-2 rounded-full">
            Breakout Sessions
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {breakoutSpeakers.map((w) => (
            <Dialog key={w.name}>
              <DialogTrigger asChild>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-transform cursor-pointer">
                  <Avatar imgUrl={w.imgUrl} />
                  <div className="flex min-h-full flex-1 flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#2aadb5] mb-0.5">
                      {w.session}
                    </p>
                    <p className="font-bold text-[#1a2e5a] text-sm leading-snug">
                      {w.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-1 leading-snug">
                      {w.role}
                    </p>
                    <p className="text-xs font-semibold text-[#1a2e5a] leading-snug">
                      &quot;{w.topic}&quot;
                    </p>
                    <p className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2aadb5]">
                      Click for more info <span aria-hidden="true">›</span>
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-auto">
                <SpeakerDetails speaker={w} />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
