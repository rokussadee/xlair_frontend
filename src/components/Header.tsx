import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Link, useLocation } from "react-router-dom";
import ig_logo from '../assets/ig_logo.svg';
import fb_logo from '../assets/fb_logo.svg';
import mixcloud_logo from '../assets/mixcloud_logo.svg';
import LiveRadioButton from './LiveRadioButton';
import { useDragControls, motion, isDragActive } from "motion/react"
import { useEffect, useLayoutEffect, useState } from "react";
// import { useScreenSize } from "../utils";

// import { MutableRefObject } from "react";

// interface Props {
//   containerRef: MutableRefObject<HTMLDivElement | null>;
// }

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
  const location = useLocation();

  // Get the active tab based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/about') return 'About';
    // Check if path starts with /shows (includes show detail pages)
    if (path.startsWith('/shows')) return 'Shows';
    return 'Home'; // Default to Home if no match
  };

  useEffect(() => {
    if (width <= 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width])

  return (
    <div className="md:mx-4 mt-6 mb-3 md:h-0 flex gap-6 flex-col lg:grid grid-cols-3 transition-all">
      <motion.div
        className="z-10"
        draggable={!isMobile}
        drag={!isMobile}
        dragControls={!isMobile ? controls : undefined}
        dragConstraints={!isMobile ? {
          top: 0,
          bottom: height - 100,
          left: 0,
          right: width - 500
        } : undefined}
        dragElastic={!isMobile ? 0.9 : undefined}
      >
        <LiveRadioButton isMobile={isMobile} />
      </motion.div>

      {isMobile && (

        <div className="flex justify-center">
          <Tabs value={getActiveTab()} className="flex justify-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Home" className="p-0 max-h-8">
                <Link to="/" className="flex flex-grow justify-center px-3 py-1.5">
                  Home
                </Link>
              </TabsTrigger>
              <TabsTrigger value="Shows" className="p-0" >
                <Link to="/shows" className="flex flex-grow justify-center px-3 py-1.5">
                  Shows
                </Link>
              </TabsTrigger>
              {/*<TabsTrigger value="About" className="p-0" >
              <Link to="/about" className="flex flex-grow justify-center px-3 py-1.5">
                About
              </Link>
            </TabsTrigger>*/}
            </TabsList>
          </Tabs>
        </div>
      )}
      <div className="flex gap-4 justify-end items-center">
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
      </div>
    </div>
  );
};

export default Header;
