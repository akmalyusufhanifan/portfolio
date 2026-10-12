"use client";

import Image from "next/image";

type Skill = {
  label: string;
  src: string;
};

const SKILLS: Skill[] = [
  { label: "JavaScript", src: "/js.png" },
  { label: "TypeScript", src: "/ts.webp" },
  { label: "React", src: "/react.webp" },
  { label: "Next.js", src: "/next.png" },
  { label: "Node.js", src: "/node.png" },
  { label: "Tailwind CSS", src: "/tailwind.png" },
  { label: "Supabase", src: "/supabase.jpg" },
  { label: "GitHub", src: "/github.png" },
];

export default function SkillsCarousel() {
  const items = [...SKILLS, ...SKILLS];

  return (
    <div
      className="group marquee-container overflow-hidden"
      aria-label="Skills carousel"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="marquee-track animate-marquee flex w-max gap-4 py-2">
        {items.map((skill, index) => (
          <div
            key={`${skill.label}-${index}`}
            aria-label={skill.label}
            title={skill.label}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-white p-2.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            tabIndex={0}
          >
            <Image
              src={skill.src}
              alt={skill.label}
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
