import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full lg:h-screen overflow-hidden">
      {/* Placeholder hero image */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-60 z-0"
      />

      {/* Centered congress branding */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <div
                className="rounded-full"
                style={{
                  width: 960,
                  height: 360,
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 80%)",
                  filter: "blur(12px)",
                }}
              />
            </div>

            <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80">
              <Image src="/logo.png" alt="CM-CMMC Logo" fill sizes="(min-width: 640px) 320px, 256px" className="object-contain" />
            </div>
          </div>
      </div>
    </section>
  );
}