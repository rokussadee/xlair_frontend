import React, { useRef, useEffect} from "react";
import { CardTitle } from "./ui/card";
// import clsx from "clsx";

interface CardTitleProps {
  title: string;
  active: boolean
}

// const PIXELS_PER_SECOND = 150;

const CustomCardTitle: React.FC<CardTitleProps> = ({ title, active }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);     
  const animationsRef = useRef<Animation[]>([]);   
  // const animationRef = useRef<Animation | null>(null);
  // const [textWidth, setTextWidth] = useState(0);
  // const [containerWidth, setContainerWidth] = useState(0);
  // const [currentPosition, setCurrentPosition] = useState(0);
  // const animatingRef = useRef<boolean>(false);

  // Calculate the width of the text and container
  // useEffect(() => {
  //   const updateDimensions = () => {
  //     if (textRef.current && containerRef.current) {
  //       setTextWidth(textRef.current.scrollWidth);
  //       setContainerWidth(containerRef.current.offsetWidth);
  //     }
  //   };

  //   updateDimensions();
  //   const resizeObserver = new ResizeObserver(updateDimensions);
  //   if (containerRef.current) {
  //     resizeObserver.observe(containerRef.current);
  //   }

  //   return () => {
  //     resizeObserver.disconnect();
  //     if (animationRef.current) {
  //       animationRef.current.cancel();
  //       animatingRef.current = false;
  //     }
  //   }
  // }, [title]);

  // const shouldAnimate = textWidth >= containerWidth;
  // const distanceToScroll = textWidth - containerWidth;


  // const handleAnimationFinish = useCallback(() => {
  //   animatingRef.current = false;
  // }, []);

  // const handleAnimationFrame = (
  //   animation: Animation,
  //   animDuration: number,
  //   isForward: boolean,
  //   startPosition: number
  // ) => {
  //   if (!animatingRef.current) return;

  //   const currentTime = animation.currentTime as number;
  //   if (currentTime !== null) {
  //     const progress = Math.min(currentTime / animDuration, 1);
  //     const newPosition = isForward
  //       ? startPosition - (distanceToScroll + startPosition) * progress
  //       : startPosition * (1 - progress);

  //     setCurrentPosition(Math.max(Math.min(newPosition, 0), -distanceToScroll));
  //   }

  //   if (animation.playState !== 'finished' && animatingRef.current) {
  //     requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, isForward, startPosition));
  //   } else {
  //     handleAnimationFinish();
  //   }
  // };

  // const handleMouseEnter = () => {
  //   if (!shouldAnimate || animatingRef.current || isNaN(currentPosition)) return;

  //   animationRef.current?.cancel();

  //   animatingRef.current = true;
  //   console.log(`currentPosition:\t${currentPosition}`);
  //   const startPosition = currentPosition;
  //   const remainingDistance = distanceToScroll + startPosition;
  //   const animDuration = Math.abs(remainingDistance) / PIXELS_PER_SECOND * 1000;
  //   console.log(`remainingDistance: ${remainingDistance}`)
  //   console.log(`animDuration: ${animDuration}`)

  //   if (typeof animDuration === "number" && animDuration >= 0) {

  //     const animation = textRef.current!.animate(
  //       [
  //         { transform: `translateX(${startPosition}px)` },
  //         { transform: `translateX(-${distanceToScroll}px)` }
  //       ],
  //       {
  //         duration: animDuration,
  //         easing: "ease-out",
  //         fill: "forwards"
  //       }
  //     );

  //     animationRef.current = animation;
  //     requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, true, startPosition));
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (isNaN(currentPosition)) return;
  //   console.log(`shouldAnimate\n${shouldAnimate}\nanimatingRef.current\n${animatingRef.current}`)

  //   animationRef.current?.cancel();

  //   animatingRef.current = true;
  //   console.log(`currentPosition:\t${currentPosition}`);
  //   let startPosition = currentPosition;
  //   console.log(`
  //     typeof startPosition:\t${typeof startPosition}\n 
  //     isNaN(startPosition):\t${isNaN(startPosition)}\n
  //   `)
  //   if (isNaN(startPosition)) {
  //     startPosition = 0
  //   }
  //   const animDuration = Math.abs(startPosition) / PIXELS_PER_SECOND * 1000;

  //   console.log(`startPosition: ${startPosition}`)
  //   console.log(`animDuration: ${animDuration}`)
    
  //   if (typeof animDuration === "number" && animDuration >= 0) {

  //     const animation = textRef.current!.animate(
  //       [
  //         { transform: `translateX(${startPosition}px)` },
  //         { transform: "translateX(0)" }
  //       ],
  //       {
  //         duration: animDuration,
  //         easing: "ease-out",
  //         fill: "forwards"
  //       }
  //     ); 
    
  //     animationRef.current = animation;
  //     requestAnimationFrame(() => handleAnimationFrame(animation, animDuration, false, startPosition));
  //   }
  // };

  const parser = new DOMParser();

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.getElementsByClassName('scrolling-text');
      
      // Initialize animations
      animationsRef.current = Array.from(elements).map(element => {
        const randomStart = Math.random() * 100;
        return element.animate(
          [
            { transform: `translateX(${randomStart}%)` },
            { transform: `translateX(${randomStart-100}})%)` }
          ],
          {
            duration: 10000, // 10 seconds
            iterations: Infinity,
            easing: 'linear'
          }
        );
      });
    }
    return () => {
      animationsRef.current.forEach(animation => animation.cancel());
    };
  }, []);

  const handleTextHover = () => {
    animationsRef.current.forEach(animation => {
      const startRate = animation.playbackRate;
      const startTime = performance.now();
      const duration = 1000;

      function updateRate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const newRate = startRate * (1 - eased);
        
        animation.updatePlaybackRate(newRate);
        
        if (progress < 1) {
          requestAnimationFrame(updateRate);
        }
      }

      requestAnimationFrame(updateRate);
    });
  };

  const handleTextLeave = () => {
    animationsRef.current.forEach(animation => {
      const startRate = animation.playbackRate;
      const startTime = performance.now();
      const duration = 1000;

      function updateRate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = Math.pow(progress, 3);
        const newRate = startRate + (1 - startRate) * eased;
        
        animation.updatePlaybackRate(newRate);
        
        if (progress < 1) {
          requestAnimationFrame(updateRate);
        }
      }

      requestAnimationFrame(updateRate);
    });
  };

  interface ScrollProps {
    title: string
  }


  // const ScrollingTitles: React.FC<ScrollProps> = ({title}) => {
  //   return (
  //     <CardTitle
  //       ref={textRef}
  //       className="flex font-medium"

  //       style={{
  //         // display: "inline-block",
  //         // transform: shouldAnimate ? `translateX(${currentPosition}px)` : undefined
  //         fontSize: `${Math.random() * 35 + 10}px`
  //       }}
  //     >
  //       <div className="whitespace-nowrap scrolling-text">
  //         &nbsp;&nbsp;{parser.parseFromString(title, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
  //       </div>
  //       <div className="whitespace-nowrap scrolling-text ">
  //         &nbsp;&nbsp;{parser.parseFromString(title, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
  //       </div>
  //       <div className="whitespace-nowrap scrolling-text">
  //         &nbsp;&nbsp;{parser.parseFromString(title, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
  //       </div>
  //       <div className="whitespace-nowrap scrolling-text ">
  //         &nbsp;&nbsp;{parser.parseFromString(title, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
  //       </div>
  //     </CardTitle>
  //   )
  // }
  
  const ScrollingTitles: React.FC<ScrollProps> = ({title}) => {
    return (
      <CardTitle
        ref={textRef}
        className="flex text-base uppercase font-medium"
      >
        <div className="inline-block">
          {parser.parseFromString(title, "text/html").documentElement.textContent}{" "}
        </div>
      </CardTitle>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden "
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      onMouseEnter={handleTextHover}
      onMouseLeave={handleTextLeave}
    >
      {active ? (

        <>
          <ScrollingTitles title={title}/>
                 
        </>

      ) : (
      <CardTitle
        ref={textRef}
        className="flex text-base font-medium"
     >
        <div className=" ">
          {parser.parseFromString(title, "text/html").documentElement.textContent}{" "}
        </div>
      </CardTitle> 
      )}
      </div>
  );
};

export default CustomCardTitle;
