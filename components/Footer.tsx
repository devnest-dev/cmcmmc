import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/sugboanongsimbahan",
    icon: <FacebookIcon />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sugboanongsimbahan/",
    icon: <InstagramIcon />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@sugboanongsimbahan",
    icon: <YouTubeIcon />,
  },
  {
    name: "X",
    href: "https://twitter.com/sugbosimbahan",
    icon: <XIcon />,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@sugboanongsimbahan",
    icon: <TikTokIcon />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f1e3d] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
        <p className="text-[12px] font-semibold text-white/90">
          The Roman Catholic Archdiocese of Cebu
        </p>
        <p className="text-[12px] text-white text-center">
          CADComM Office, IEC Tower, Archbishop&apos;s Residence Compound, D. Jakosalem St., Cebu City, 6000, Philippines 
        </p>
        <p className="text-[12px] text-white">thearchdioceseofcebu@gmail.com</p>
        <Link
          href="https://thearchdioceseofcebu.com/"
          target="_blank"
          className="text-[12px] text-white underline underline-offset-2 hover:text-[#0091C0] transition-colors"
        >
          thearchdioceseofcebu.com
        </Link>

        {/* Social icons */}
        <div className="flex items-center gap-3 mt-2">
          {socialLinks.map((s) => (
            <Link key={s.name} href={s.href} aria-label={s.name}>
              {s.icon}
            </Link>
          ))}
        </div>

        <p className="text-[12px] text-white mt-2">
          Copyright 2026 © The Roman Catholic Archdiocese of Cebu. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}
