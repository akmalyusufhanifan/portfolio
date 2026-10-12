"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type NavItem = {
  label: string;
  href: string;
  color: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about", color: "text-[#F59E0B]" },
  { label: "Projects", href: "#projects", color: "text-[#38BDF8]" },
  { label: "Contact", href: "#contact", color: "text-[#34D399]" },
];

type NavbarProps = {
  siteName?: string;
};

export default function Navbar({ siteName = "Akmal.dev" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Manual nav handler for bubble: close, unlock scroll, then smooth scroll (fixes hash blocked by overflow:hidden)
  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    e.preventDefault();
    setOpen(false);
    const id = href.slice(1);
    // rAF ensures body overflow restore (scroll lock cleanup) has run before scrolling
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      history.pushState(null, "", href);
    });
  }

  // Close on click outside (containerRef now covers header+bubble)
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Close menu when resizing to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && open) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Scroll lock when bubble open on mobile/tablet (<1024px)
  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header ref={containerRef} className="relative z-20 h-16 w-full bg-white">
        {/* Header dim overlay - darkens navbar itself when bubble open */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-black/20 transition-opacity duration-200 lg:hidden ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Website Logo - zoom with object-cover */}
          <a
            href="#hero"
            onClick={() => setOpen(false)}
            className="flex items-center overflow-hidden"
            aria-label={`${siteName} - back to hero`}
          >
            <div className="relative h-10 w-[132px] overflow-hidden lg:h-12 lg:w-[156px]">
              <Image
                src="/website-logo.png"
                alt={siteName}
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 156px, 132px"
              />
            </div>
          </a>

          {/* Right: Desktop Navigation - hidden on tablet/mobile, visible on lg */}
          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-10">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`group relative inline-block px-2 py-2 text-[16px] font-medium transition-all hover:brightness-95 focus-visible:outline-none ${item.color}`}
                  >
                    {item.label}
                    <span className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current transition-all duration-200 ease-out group-hover:w-full group-focus-visible:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Hamburger Button - visible on tablet/mobile, hidden on lg */}
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="navbar-menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Mobile/Tablet Bubble Menu - anchored top-right near hamburger */}
        <div
          id="navbar-menu"
          className={`absolute right-4 top-16 h-[172px] w-[154px] origin-top-right rounded-[16px] border border-zinc-100 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out lg:hidden ${
            open
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
          aria-hidden={!open}
        >
          {/* Bubble tail - slightly rounded near hamburger, inset from right edge */}
          <div
            aria-hidden="true"
            className="absolute -top-[8px] right-4 h-3 w-3 rotate-45 rounded-[3px] border-l border-t border-zinc-100 bg-white"
          />
          <nav
            className="flex h-full items-center justify-center px-4 py-4"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col items-center gap-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`group relative inline-block px-2 py-1.5 text-center text-[14px] font-medium transition-all hover:brightness-95 focus-visible:outline-none ${item.color}`}
                  >
                    {item.label}
                    <span className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current transition-all duration-200 ease-out group-hover:w-full group-focus-visible:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Backdrop overlay - dims website background when bubble open (absolute, scrolls with header) */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 top-16 z-10 bg-black/20 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
