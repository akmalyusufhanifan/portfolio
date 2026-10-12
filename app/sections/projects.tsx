import Reveal from "../components/reveal";

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-[1100px] lg:px-8">
        <Reveal delay={0}>
          <h2 className="text-left text-[56px] font-semibold tracking-tight text-zinc-900 lg:text-left lg:text-[92px]">
            <span className="text-[#38BDF8]">My</span> Projects
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <div
            className="group marquee-container relative mt-8 overflow-hidden lg:mt-10"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
          {/* Skeleton carousel — blurred, all viewports */}
          <div
            className="marquee-track animate-marquee flex w-max gap-6 py-2 blur-[2px] opacity-85 pointer-events-none select-none"
            aria-hidden="true"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[220px] w-[300px] shrink-0 flex-col gap-3 rounded-[24px] border border-zinc-300 bg-white p-4 shadow-md lg:h-[320px] lg:w-[360px]"
              >
                <div className="h-24 w-full rounded-[16px] bg-zinc-300 animate-pulse motion-reduce:animate-none lg:h-36" />
                <div className="h-3 w-3/4 rounded bg-zinc-300 animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-1/2 rounded bg-zinc-300 animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-full rounded bg-zinc-300 animate-pulse motion-reduce:animate-none" />
                <div className="mt-auto flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-zinc-300 animate-pulse motion-reduce:animate-none" />
                  <div className="h-6 w-16 rounded-full bg-zinc-300 animate-pulse motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Overlay — static center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 px-4 text-center backdrop-blur-[1px]">
            <h3 className="max-w-[320px] text-[22px] font-semibold tracking-tight text-zinc-900 lg:max-w-none lg:text-[32px]">
              Want to be my first client?
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-zinc-800 lg:text-[16px]">
              Let&apos;s build something together
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111827] px-7 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 lg:text-[15px]"
            >
              Contact Me
            </a>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
