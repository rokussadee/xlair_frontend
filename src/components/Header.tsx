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

import { Link } from "react-router-dom";
import ig_logo from '../assets/ig_logo.svg';
import fb_logo from '../assets/fb_logo.svg';
import mixcloud_logo from '../assets/mixcloud_logo.svg';

const Header = () => {

  return (
    <nav className="mx-auto md:mx-4 mt-6 mb-3 flex gap-6 flex-col lg:grid grid-cols-3 items-center transition-all">
      <div className="flex justify-center">
        <Tabs defaultValue="Home" className="flex justify-center">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Home" className="p-0 max-h-8">
              <Link to="/" className="flex flex-grow justify-center px-3 py-1.5">
                {/* <Img 
                  src={logo} 
                  alt="Xlair radio logo"
                  width={100}
                  height={0} 
                  className="relative -top-1"/> */}
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
        <div>

        </div>
      </div>
    </nav>
  );
};

export default Header;

