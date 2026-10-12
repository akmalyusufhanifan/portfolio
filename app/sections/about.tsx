import SkillsCarousel from "../components/skills-carousel";
import Reveal from "../components/reveal";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-[1100px] lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Row 1 — Heading: mobile order-1, desktop col-1 row-1 */}
          <Reveal
            delay={0}
            className="order-1 lg:col-start-1 lg:row-start-1"
          >
            <h2 className="text-left text-[56px] font-semibold tracking-tight text-zinc-900 lg:text-left lg:text-[92px]">
              About <span className="text-[#F59E0B]">Me</span>
            </h2>
          </Reveal>

          {/* Row 2 — Image: mobile order-2, desktop col-2 span 3 rows */}
          <Reveal
            delay={90}
            className="relative order-2 justify-self-center mb-8 w-[300px] h-[300px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:w-[350px] lg:h-[500px] lg:justify-self-end"
          >
            <div className="relative h-full w-full">
              <Image
                src="/profile.png"
                alt="Profile Image"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Row 3 — Paragraph: mobile order-3, desktop col-1 row-2 */}
          <Reveal
            delay={180}
            className="order-3 mb-4 lg:col-start-1 lg:row-start-2"
          >
            <p className="mx-auto max-w-[340px] text-center text-[15px] leading-relaxed text-zinc-600 md:max-w-[560px] lg:mx-0 lg:max-w-[480px] lg:text-left lg:text-[20px] lg:text-zinc-700">
              I’m a Full Stack Developer who enjoys turning ideas into
              meaningful digital experiences. I love learning through building,
              exploring new technologies, and solving problems with clean,
              practical code. Always learning, improving, and creating useful
              products.
            </p>
          </Reveal>

          {/* Row 4 — Skills: mobile order-4, desktop col-1 row-3 */}
          <Reveal
            delay={270}
            className="order-4 lg:col-start-1 lg:row-start-3"
          >
            <h3 className="text-center text-[28px] font-semibold tracking-tight text-zinc-900 lg:text-left lg:text-[42px]">
              Skills
            </h3>
            <div className="mt-4">
              <SkillsCarousel />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
