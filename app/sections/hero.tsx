import Image from "next/image";
import { FaHandPeace } from "react-icons/fa";
import Reveal from "../components/reveal";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="flex justify-center bg-white px-4 py-6 md:py-8 lg:py-10"
    >
      <div
        className="
          flex flex-col items-center justify-center gap-4
          bg-gradient-to-br from-[#FBED96] to-[#ABECD6]
          px-8 py-8 text-center
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          w-[327px] h-[530px] rounded-[32px]
          md:w-[90%] md:max-w-[1100px] md:h-auto md:min-h-[420px] md:py-12 md:rounded-[32px]
          lg:w-[1100px] lg:h-[580px] lg:rounded-[40px] lg:p-12 lg:gap-5
        "
      >
        {/* Profile Circle */}
        <Reveal immediate delay={0}>
          <div
            aria-hidden="true"
            className="relative h-18 w-18 items-center justify-center rounded-full md:h-20 md:w-20 lg:h-28 lg:w-28"
          >
            <Image
              src="/photo-profile.jpg"
              alt="Akmal's profile picture"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal immediate delay={90}>
          <h1 className="text-[22px] text-zinc-900 lg:text-[40px]">
            Hi, I am Akmal{" "}
            <FaHandPeace className="inline-block -translate-y-1 lg:-translate-y-2 text-[#F59E0B] text-[22px] lg:text-[40px]" />
          </h1>
        </Reveal>

        <Reveal immediate delay={180}>
          <p className="max-w-[280px] text-[32px] font-medium leading-relaxed text-[#111827] md:max-w-[550px] lg:max-w-[820px] lg:text-[50px]">
            I <span className="text-[#38BDF8]">craft</span> digital experiences
            where <span className="text-[#F43F5E]">ideas</span> meet thoughtful
            <span className="text-[#F59E0B]"> code</span>
          </p>
        </Reveal>

        <Reveal immediate delay={270}>
          <a
            href="#contact"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#111827] px-7 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 lg:mt-3 lg:text-[15px]"
          >
            Contact Me
          </a>
        </Reveal>
      </div>
    </section>
  );
}
