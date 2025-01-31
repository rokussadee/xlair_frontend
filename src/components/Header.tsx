// import { useLocation } from "react-router-dom";
import LiveRadioButton from './LiveRadioButton';
import AnnouncementComponent from '../components/AnnouncementComponent';

import { useDragControls, motion } from "motion/react"
import { useEffect, useLayoutEffect, useState } from "react";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const Header = (
  // {containerRef}: Props
) => {
  const [width, height] = useWindowSize();
  const [isMobile, setIsMobile] = useState(width <= 768);

  const controls = useDragControls()

  useEffect(() => {
    if (width <= 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width])

  return (
    <div className="mx-4 sm:mx-6 mt-6 mb-2 gap-3 md:gap-6 flex-col flex md:flex-row transition-all ">
      <motion.div
        className="z-[100] flex-shrink"
        draggable={!isMobile}
        drag={!isMobile}
        dragControls={!isMobile ? controls : undefined}
        dragConstraints={!isMobile ? {
          top: 0,
          bottom: height - 100,
          left: 0,
          right: width - 340
        } : undefined}
        dragElastic={!isMobile ? 0.9 : undefined}
      >
        <LiveRadioButton />
      </motion.div>

      {/* <div className="flex gap-4 items-center ml-5 mb-2 opacity-60">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a href="https://www.mixcloud.com/XLAIR/" target="blank">
                  <img width="50" src={mixcloud_logo} alt="mixcloud xlair" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                mixcloud.com/XLAIR
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a href="https://www.instagram.com/xlairradio/" target="blank">
                  <img width="20" src={ig_logo} alt="instagram xlair" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                instagram.com/xlairradio
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a href="https://www.facebook.com/xlairradio" target="blank">
                  <img width="20" src={fb_logo} alt="facebook xlair" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                facebook.com/xlairradio
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div> */}
      <AnnouncementComponent />
    </div>
  );
};

export default Header;
