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

const Header = () => {
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

  return (
    <nav className="mx-auto md:mx-4 mt-6 mb-3 flex gap-6 flex-col lg:grid grid-cols-3 items-center transition-all">
      <div className="flex justify-center">
        <Tabs value={getActiveTab()} className="flex justify-center">
          <TabsList className="grid w-full grid-cols-3">
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
            <TabsTrigger value="About" className="p-0" >
              <Link to="/about" className="flex flex-grow justify-center px-3 py-1.5">
                About
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
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
    </nav>
  );
};

export default Header;