import { MapPin, Calendar, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white lg:h-screen">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: About the congress */}
        <div>
          <p className="text-[#1a2e5a] text-base leading-relaxed mb-6">
            The{" "}
            <span className="font-bold">
              Cebu Metropolitan Catholic Mass Media Congress (CM-CMMC)
            </span>{" "}
            is a biennial gathering of Church media ministers from various
            dioceses and institutions, offering an avenue for formation,
            reflection, and shared insights as they continue their mission of
            evangelizing in the digital world.
          </p>

          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[#e63946] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[#1a2e5a] text-sm">
                Recoletos Coliseum
              </p>
              <p className="text-gray-500 text-sm">
                University of San Jose-Recoletos, Basak Pardo, Cebu City
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#2aadb5] mt-0.5 shrink-0" />
            <p className="font-semibold text-[#1a2e5a] text-sm">
              3 - 4 October 2026
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#f09414] mt-0.5 shrink-0" />
            <p className="text-gray-600 text-sm">
              Parish Social Communication members, religious men and women,
              students, communications professionals
            </p>
          </div>
        </div>

        {/* Right: Congress theme */}
        <div>
          <div className="inline-block bg-[#56aeff] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Congress Theme
          </div>
          <blockquote className="text-[#1a2e5a] text-xl sm:text-3xl font-bold leading-snug mb-4">
            &quot;To Work and to Take Care{" "}
            <span className="italic font-normal text-lg">(Gen. 2:15)</span>:{" "}
            Human Dignity at the Heart of AI Innovation in Media Ministry,&quot;
          </blockquote>
          <p className="text-gray-600 text-sm leading-relaxed">
            In the age of Artificial Intelligence (AI), we are called to
            actively guide and use technology in ways that serve our
            mission—enhancing communication while ensuring it remains rooted in
            human discernment and authentic relationships. This year&apos;s
            Congress theme, &quot;To Work and to Take Care&quot; (Gen. 2:15),
            reminds us that we are entrusted with the responsibility to shape
            media with creativity, integrity, and a deep respect for human
            dignity.
          </p>
        </div>
      </div>
    </section>
  );
}
