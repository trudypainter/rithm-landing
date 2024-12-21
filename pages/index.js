"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import AnimationControls from "../components/AnimationControls";
import Head from "next/head";

const DEFAULT_ANIMATION_CONFIG = {
  baseGlow: 10,
  desktopMaxGlowIncrease: 150,
  mobileMaxGlowIncrease: 38,
  desktopSpreadRadius: 10,
  mobileSpreadRadius: 10,
  maxOpacity: 0.8,
  decayRate: 0.98,
  scrollMultiplier: 80,
};

const INITIAL_MESSAGES = [
  { text: "Uhhh... so what is this?", isRight: true },
  { text: "this is Rithm", isRight: false },
  {
    text: "It's a dating app... where you swipe on other people's algorithms.",
    isRight: false,
  },
  { text: "like tinder but for FYPs", isRight: false },
  { text: "ur joking... that's so fried", isRight: true },
  {
    text: "i mean maybe... but in a way the algorithm knows you better than you know yourself",
    isRight: false,
  },
  {
    text: "i think we'd learn a lottttt about you if we took a look at your FYP",
    isRight: false,
  },
  { text: "freak", isRight: true },
  { text: "fine when can i get it", isRight: true },
  { text: "valentines day (feb 14)", isRight: false },
  {
    text: "mark your calendar... and scroll your heart out",
    isRight: false,
  },
];

export default function RithmLanding() {
  const [messages, setMessages] = useState([
    ...INITIAL_MESSAGES,
    ...INITIAL_MESSAGES,
    ...INITIAL_MESSAGES,
    ...INITIAL_MESSAGES,
  ]);
  const [scrollIntensity, setScrollIntensity] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [animationConfig, setAnimationConfig] = useState(
    DEFAULT_ANIMATION_CONFIG
  );
  const [spreadRadius, setSpreadRadius] = useState(
    DEFAULT_ANIMATION_CONFIG.desktopSpreadRadius
  );
  const [maxGlowIncrease, setMaxGlowIncrease] = useState(
    DEFAULT_ANIMATION_CONFIG.desktopMaxGlowIncrease
  );
  const scrollRef = useRef(null);
  const observerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const animationFrameRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMessages((prev) => [...prev, ...INITIAL_MESSAGES]);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastScrollY = 0;
    let scrollTimeout;

    const handleScroll = () => {
      if (!scrollRef.current) return;

      const currentTime = Date.now();
      const scrollY = scrollRef.current.scrollTop;
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      const timeDelta = currentTime - lastScrollTime.current;

      const scrollSpeed = timeDelta > 0 ? scrollDelta / timeDelta : 0;
      const newIntensity = Math.max(
        0.1,
        Math.min(scrollSpeed * animationConfig.scrollMultiplier, 1)
      );

      setScrollIntensity(newIntensity);

      lastScrollY = scrollY;
      lastScrollTime.current = currentTime;

      clearTimeout(scrollTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      scrollTimeout = setTimeout(() => {
        const decay = () => {
          setScrollIntensity((prev) => {
            const newValue = Math.max(0.1, prev * animationConfig.decayRate);
            if (newValue <= 0.1) return 0.1;
            animationFrameRef.current = requestAnimationFrame(decay);
            return newValue;
          });
        };

        animationFrameRef.current = requestAnimationFrame(decay);
      }, 100);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(scrollTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationConfig.scrollMultiplier, animationConfig.decayRate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleScreenChange = (e) => {
      setSpreadRadius(
        e.matches
          ? DEFAULT_ANIMATION_CONFIG.mobileSpreadRadius
          : DEFAULT_ANIMATION_CONFIG.desktopSpreadRadius
      );
      setMaxGlowIncrease(
        e.matches
          ? DEFAULT_ANIMATION_CONFIG.mobileMaxGlowIncrease
          : DEFAULT_ANIMATION_CONFIG.desktopMaxGlowIncrease
      );
    };

    // Set initial value
    handleScreenChange(mediaQuery);

    // Add listener for changes
    mediaQuery.addListener(handleScreenChange);

    return () => mediaQuery.removeListener(handleScreenChange);
  }, []);

  return (
    <>
      <Head>
        <title>Rithm</title>
        <meta name="description" content="Swipe on algorithms, not people" />
        <link rel="icon" href="/Heart.png" />
      </Head>
      <div className="min-h-screen bg-black text-white text-xl relative px-4">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${
              animationConfig.baseGlow + scrollIntensity * maxGlowIncrease
            }px ${scrollIntensity * spreadRadius}px rgba(236, 72, 153, ${
              scrollIntensity * animationConfig.maxOpacity
            })`,
          }}
        />

        {/* <AnimationControls
          showControls={showControls}
          setShowControls={setShowControls}
          animationConfig={animationConfig}
          setAnimationConfig={setAnimationConfig}
          defaultConfig={DEFAULT_ANIMATION_CONFIG}
        /> */}

        <div className="w-full max-w-md mx-auto h-screen">
          <div
            ref={scrollRef}
            className="hide-scrollbar h-full overflow-auto px-4"
          >
            {messages.map((message, index) => (
              <div key={index}>
                {index === INITIAL_MESSAGES.length && (
                  <div ref={observerRef} className="h-0" />
                )}
                {index % INITIAL_MESSAGES.length === 0 && (
                  <div className="flex justify-center h-32 items-center">
                    <Heart
                      className="w-24 h-24 text-pink-400 animate-pulse"
                      fill="currentColor"
                      strokeWidth={1}
                    />
                  </div>
                )}
                <div
                  className={`flex ${
                    message.isRight ? "justify-end" : "justify-start"
                  } mb-6`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.isRight
                        ? "bg-gray-700 rounded-tr-none"
                        : "bg-gray-600 rounded-tl-none"
                    }`}
                  >
                    <p className="text-xl ">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
