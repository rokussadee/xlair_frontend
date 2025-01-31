import React, { useState, useRef, useEffect, useCallback } from "react";
import { CardTitle } from "./ui/card";
import clsx from "clsx";

interface CardTitleProps {
  title: string;
  active: boolean
}

const PIXELS_PER_SECOND = 150;

const CustomCardTitle: React.FC<CardTitleProps> = ({ title, active }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const animatingRef = useRef<boolean>(false);

  // Calculate the width of the text and container
  useEffect(() => {
    const updateDimensions = () => {
      if (textRef.current && containerRef.current) {
        setTextWidth(textRef.current.scrollWidth);
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        animationRef.current.cancel();
        animatingRef.current = false;
      }
    }
  }, [title]);

  const shouldAnimate = textWidth >= containerWidth;
  const distanceToScroll = textWidth - containerWidth;


  const handleAnimationFinish = useCallback(() => {
    animatingRef.current = false;
  }, []);

  const handleAnimationFrame = (
    animation: Animation,
    animDuration: number,
    isForward: boolean,
    startPosition: number
  ) => {
    if (!animatingRef.current) return;

    const currentTime = animation.currentTime as number;
    if (currentTime !== null) {
      const progress = Math.min(currentTime / animDuration, 1);
      const newPosition = isForward
        ? startPosition - (distanceToScroll + startPosition) * progress
        : startPosition * (1 - progress);

      setCurrentPosition(Math.max(Math.min(newPosition, 0), -distanceToScroll));
    }

    if (animation.playState !== 'finished' && animatingRef.current) {
      requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, isForward, startPosition));
    } else {
      handleAnimationFinish();
    }
  };

  const handleMouseEnter = () => {
    if (!shouldAnimate || animatingRef.current || isNaN(currentPosition)) return;

    animationRef.current?.cancel();

    animatingRef.current = true;
    console.log(`currentPosition:\t${currentPosition}`);
    const startPosition = currentPosition;
    const remainingDistance = distanceToScroll + startPosition;
    const animDuration = Math.abs(remainingDistance) / PIXELS_PER_SECOND * 1000;
    console.log(`remainingDistance: ${remainingDistance}`)
    console.log(`animDuration: ${animDuration}`)

    if (typeof animDuration === "number" && animDuration >= 0) {

      const animation = textRef.current!.animate(
        [
          { transform: `translateX(${startPosition}px)` },
          { transform: `translateX(-${distanceToScroll}px)` }
        ],
        {
          duration: animDuration,
          easing: "ease-out",
          fill: "forwards"
        }
      );

      animationRef.current = animation;
      requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, true, startPosition));
    }
  };

  const handleMouseLeave = () => {
    if (isNaN(currentPosition)) return;
    console.log(`shouldAnimate\n${shouldAnimate}\nanimatingRef.current\n${animatingRef.current}`)

    animationRef.current?.cancel();

    animatingRef.current = true;
    console.log(`currentPosition:\t${currentPosition}`);
    let startPosition = currentPosition;
    console.log(`
      typeof startPosition:\t${typeof startPosition}\n 
      isNaN(startPosition):\t${isNaN(startPosition)}\n
    `)
    if (isNaN(startPosition)) {
      startPosition = 0
    }
    const animDuration = Math.abs(startPosition) / PIXELS_PER_SECOND * 1000;

    console.log(`startPosition: ${startPosition}`)
    console.log(`animDuration: ${animDuration}`)
    
    if (typeof animDuration === "number" && animDuration >= 0) {

      const animation = textRef.current!.animate(
        [
          { transform: `translateX(${startPosition}px)` },
          { transform: "translateX(0)" }
        ],
        {
          duration: animDuration,
          easing: "ease-out",
          fill: "forwards"
        }
      ); 
    
      animationRef.current = animation;
      requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, false, startPosition));
    }
  };

  const parser = new DOMParser();

  const isAtStart = currentPosition >= -1;
  const isAtEnd = currentPosition <= -distanceToScroll + 1;
  // console.log(`
  //   currentPosition:\t${currentPosition}\n 
  //   distanceToScroll:\t${distanceToScroll}\n`)

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden h-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Gradient - only visible when scrolled away from start */}
      <div
        className={clsx("absolute inset-y-0 left-0 w-8 bg-gradient-to-r z-10 pointer-events-none transition-opacity duration-300", active ? "from-[rgba(153,27,27,0.3)] via-red-800/30 to-transparent" : "from-[#1c1c1c] via-[#1c1c1c]/50 to-transparent")}
        style={{ opacity: shouldAnimate && !isAtStart ? 1 : 0 }}
      >
      </div>  
      <div
      className={clsx("absolute -left-1 w-2 h-8 -top-1 z-20 pointer-events-none transition-opacity duration-300 backdrop-blur-xl gradient-mask-r-[rgba(1,1,1,1.0),rgba(1,1,1,1.0)_50%,transparent]")}></div>
      {/* <div 
        className={clsx("absolute inset-y-0 left-0 w-full z-10 pointer-events-none transition-opacity duration-300", shouldAnimate && !isAtStart && !isAtEnd ? "gradient-mask-r-[transparent,rgba(1,1,1,1.0)_10%,rgba(1,1,1,1.0)_90%,transparent]" : "gradient-mask-r-[white, white]")}
        > */}
      {/* Animated Text */}
      <CardTitle
        ref={textRef}
        className="whitespace-nowrap text-base font-medium"
        style={{
          display: "inline-block",
          transform: shouldAnimate ? `translateX(${currentPosition}px)` : undefined
        }}
      >
        {parser.parseFromString(title, "text/html").documentElement.textContent}{" "}
      </CardTitle>

      {/* </div> */}
      {/* Right Gradient - only visible when not at the end */}
      <div
        className="absolute inset-y-0 -right-1 w-8 bg-gradient-to-l from-[#1c1c1c] via-[#1c1c1c]/50 to-transparent z-10 pointer-events-none transition-opacity duration-300 blur-sm"
        style={{ opacity: shouldAnimate && !isAtEnd ? 1 : 0 }}
      > 
        </div>
    </div>
  );
};

export default CustomCardTitle;
