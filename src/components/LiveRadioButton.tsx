import { useState, useRef } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import { format } from 'date-fns';

import logo from '../assets/logo_white_full.png';
import playIcon from '../assets/play_button.svg';
import stopIcon from '../assets/stop_button.svg';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";


import { useRecoilValue } from 'recoil';
import { currentEventSelector, nextEventSelector } from '../store';
import { Link } from 'react-router-dom';

interface Props {
  isMobile: boolean
}

const LiveRadioButton = ({ isMobile }: Props) => {
  const currentEvent = useRecoilValue(currentEventSelector);
  const nextEvent = useRecoilValue(nextEventSelector);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const muteAudio = (mute: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = mute ? true : false;
    }
  }

  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      audioRef.current?.play();
    }
    if (audioRef.current) {
      if (!isPlaying) {
        muteAudio(false);
        setIsPlaying(true);
      } else {
        muteAudio(true)
        setIsPlaying(false);
      }
    }
  };
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/about') return 'About';
    // Check if path starts with /shows (includes show detail pages)
    if (path.startsWith('/shows')) return 'Shows';
    return 'Home'; // Default to Home if no match
  };



  // Create display text for the current event
  const displayText = currentEvent.startTime
    ? `${currentEvent.title} (${format(new Date(currentEvent.startTime), 'p')} - ${format(new Date(currentEvent.endTime), 'p')})`
    : currentEvent.title;

  const buttonSize = 25;

  return (
    <div className="cursor-grabbing hover:cursor-grab static pb-2 p-3  bottom-5 bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur rounded-lg h-24 border border-zinc-700 max-w-xs">

      <audio ref={audioRef} src="https://kioskradiobxl.out.airtime.pro/kioskradiobxl_b"
      // muted={isPlaying ? false : true} 
      />
      <div  
        className='h-12 '
      >
        <Img
          draggable={false}
          src={logo}
          alt="Xlair radio logo"
          width={135}
          height={0}
          className="absolute -top-[16px] -left-3 z-20" />
        <Img
          draggable={false}
          src={logo}
          alt="Xlair radio logo"
          width={135}
          height={0}
          className="absolute -top-[16px] -left-3 blur z-20 opacity-70" />
          <div
            className='ml-36 '
          >
              <div className="grid w-full grid-cols-2  ">
                <div value="Home" className="p-0 rounded-md border border-zinc-700 mr-2 max-h-8 transition-all bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur border-white-1">
                  <Link to="/" className="flex flex-grow justify-center px-3 py-1.5 text-xs text-white">
                    Home
                  </Link>
                </div>
                <div value="Shows" className="p-0 rounded-md border border-zinc-700 max-h-8 transition-all bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur border-white-1" >
                  <Link to="/shows" className="flex flex-grow justify-center px-3 py-1.5 text-xs text-white">
                    Shows
                  </Link>
                </div>
                {/*<TabsTrigger value="About" className="p-0" >
              <Link to="/about" className="flex flex-grow justify-center px-3 py-1.5">
                About
              </Link>
            </TabsTrigger>*/}
              </div>
          </div>

      </div>

      <div
        className='flex md:items-center justify-between'
      >
        <div className='relative w-72 overflow-hidden flex items-center'>
          <div className='align-middle z-50 overflow-visible p-0.5 mr-1'>
            <div className={clsx("rounded-full h-[7px] w-[7px] transition-all duration-200 outline outline-[0.05px]", isPlaying ? "bg-red-600 outline-red-400" : "bg-transparent  outline-white")}>
            </div>
            <div className={clsx("absolute top-2 rounded-full h-[7px] w-[7px] opacity-40 transition-all duration-200 outline outline-[0.1px] blur-[1px]", isPlaying ? "outline-red-400 bg-red-600 animate-pulse " : "bg-transparent")}>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex w-64 overflow-hidden gradient-mask-r-[transparent,rgba(1,1,1,1.0)_10%,rgba(1,1,1,1.0)_90%,transparent]">
                  <p className="whitespace-nowrap text-xs animate-endless">
                    &nbsp;&nbsp;{new DOMParser().parseFromString(displayText, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
                  </p>
                  <p className="whitespace-nowrap text-xs animate-endless">
                    &nbsp;&nbsp;{new DOMParser().parseFromString(displayText, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
                  </p>
                  <p className="whitespace-nowrap text-xs animate-endless">
                    &nbsp;&nbsp;{new DOMParser().parseFromString(displayText, "text/html").documentElement.textContent}{" "}&nbsp;&nbsp;&#x266B;
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                UP NEXt: {new DOMParser().parseFromString(nextEvent.title, "text/html").documentElement.textContent}{" "}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
        <div className='flex content-center '>
          <button className="flex-end" onClick={handlePlayPause}>
            {isPlaying ? (
              <div className="flex items-center gap-2 ">
                <Img src={stopIcon} alt="Stop Button" width={buttonSize} height={buttonSize} />
              </div>
            ) : (
              <div className="flex items-center gap-2 ">
                <Img src={playIcon} alt="Play Button" width={buttonSize} height={buttonSize} />
              </div>
            )}
          </button>
        </div>
      </div>

    </div >
  );
};

export default LiveRadioButton;

