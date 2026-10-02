import { SPEAKERS } from "@/lib/speakers";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import SpeakerDetails from "./SpeakerDetails";
import { useMemo } from "react";

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
          className="w-6 h-6 text-[#f09414]"
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

export default function SpeakersSection() {
  const keynoteSpeaker = useMemo(
    () => SPEAKERS.find((s) => s.session === "Keynote"),
    [],
  );
  const plenarySpeakers = useMemo(
    () => SPEAKERS.filter((s) => s.session?.startsWith("Plenary Session")),
    [],
  );

  return (
    <section
      id="speakers"
      className="py-8 lg:h-screen"
      style={{
        background:
          "linear-gradient(135deg, #eaf7f8 0%, #f5f9ff 50%, #fff8ee 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
          {/* Left: speakers image (hidden on small screens) */}
          <div className="hidden lg:block w-1/3 rounded-xl overflow-hidden h-full">
            <img
              src="/speakers.jpg"
              alt="Speakers"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: content */}
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              {/* Section heading */}
              <div className="flex justify-center mb-6 lg:justify-start">
                <div className="bg-[#56aeff] text-white text-sm font-bold uppercase tracking-widest px-8 py-2 rounded-full">
                  Meet Our Congress&apos; Speakers
                </div>
              </div>

              {/* Keynote */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Keynote
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex w-full items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md cursor-pointer">
                      <Avatar size="lg" imgUrl={keynoteSpeaker?.imgUrl} />
                      <div>
                        <p className="font-bold text-[#1a2e5a] text-base">
                          {keynoteSpeaker!.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {keynoteSpeaker!.role}
                        </p>
                        <p className="text-sm text-gray-700 italic">
                          {keynoteSpeaker!.topic}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2aadb5]">
                          Click for more info <span aria-hidden="true">›</span>
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-auto">
                    <SpeakerDetails speaker={keynoteSpeaker!} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Plenary sessions */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Plenary Sessions
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {plenarySpeakers.map((s) => (
                    <Dialog key={s.name}>
                      <DialogTrigger asChild>
                        <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md cursor-pointer">
                          <div className="flex items-start gap-3">
                            <Avatar imgUrl={s.imgUrl} />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2aadb5]">
                                {s.session}
                              </p>
                              <p className="font-bold text-[#1a2e5a] text-sm">
                                {s.name}
                              </p>
                              <p className="text-xs text-gray-500 leading-snug">
                                {s.role}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 italic border-t border-gray-100 pt-3">
                            {s.topic}
                          </p>
                          <p className="text-[11px] font-semibold text-[#2aadb5]">
                            Click for more info{" "}
                            <span aria-hidden="true">›</span>
                          </p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-auto">
                        <SpeakerDetails speaker={s} />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
