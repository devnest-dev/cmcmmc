export default function FirstCongress() {
  return (
    <section className="py-16 bg-gray-50 lg:h-screen">
      <div className="h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold text-[#1a2e5a] mb-3">
          Relive the fun and learnings from the first CM-CMMC
        </h2>
        <p className="text-gray-600 text-sm mb-8 max-w-2xl mx-auto">
          More than 400 participants from the Archdiocese of Cebu and
          neighboring dioceses joined the first Cebu Metropolitan Catholic Mass
          Media Congress (CM-CMMC) last September 28, 2024.
        </p>

        {/* Image placeholder */}
        <div className="relative w-full max-w-7xl mx-auto aspect-video rounded-xl overflow-hidden bg-[#1a2e5a]/10 border border-gray-200 flex flex-col items-center justify-center gap-2">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/FBqyz41m15I?si=9TJ35m6hzfhJyLkB"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={true}
          />
        </div>
      </div>
    </section>
  );
}
