import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import { format } from 'date-fns';

import logo from '../assets/logo_white_full.png';
import playIcon from '../assets/play_button.svg';
import stopIcon from '../assets/stop_button.svg';

import { useRecoilValue } from 'recoil';
import { currentEventSelector } from '../store';

const LiveRadioButton = () => {
  const currentEvent = useRecoilValue(currentEventSelector);
  console.log(`currentEvent: ${currentEvent}`);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const muteAudio = (mute: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = mute ? true : false; 
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        muteAudio(false);
        setIsPlaying(true);
      } else {
        audioRef.current.muted = true;
        muteAudio(true)
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    audioRef.current?.play();
    muteAudio(true);
  }, [])

  // Create display text for the current event
  const displayText = currentEvent.startTime
    ? `${currentEvent.title} (${format(new Date(currentEvent.startTime), 'p')} - ${format(new Date(currentEvent.endTime), 'p')})`
    : currentEvent.title;

  return (
    <div className="fixed bottom-5 bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur rounded-lg items-center h-10 border border-white flex p-1 left-4 right-4">

      <audio ref={audioRef} src="https://kioskradiobxl.out.airtime.pro/kioskradiobxl_b"
        // muted={isPlaying ? false : true} 
      />

      <Img
        src={logo}
        alt="Xlair radio logo"
        width={120}
        height={0}
        className="absolute -top-[18px] -left-3 z-20" />
      <Img
        src={logo}
        alt="Xlair radio logo"
        width={120}
        height={0}
        className="absolute -top-[18px] -left-3 blur z-20 opacity-70" />

      <div className='relative overflow-hidden ml-[97px] flex items-center'>
        <div className='align-middle z-50 overflow-visible p-0.5 mr-1'>
          <div className={clsx("rounded-full h-[7px] w-[7px] transition-all duration-200 outline outline-[0.05px]", isPlaying ? "bg-red-600 outline-red-400" : "bg-transparent  outline-white")}>
          </div>
          <div className={clsx("absolute top-1 rounded-full h-[7px] w-[7px] opacity-40 transition-all duration-200 outline outline-[0.1px] blur-[1px]", isPlaying ? "outline-red-400 bg-red-600 animate-pulse " : "bg-transparent")}>
          </div>
        </div>


        <div className="flex overflow-hidden gradient-mask-r-[transparent,rgba(1,1,1,1.0)_10%,rgba(1,1,1,1.0)_90%,transparent]">
          <p className="whitespace-nowrap text-xs animate-endless">
            &nbsp;&nbsp;{displayText}&nbsp;&nbsp;&#x266B;
          </p>
          <p className="whitespace-nowrap text-xs animate-endless">
            &nbsp;&nbsp;{displayText}&nbsp;&nbsp;&#x266B;
          </p>
        </div>

      </div>
      <button className="pr-2" onClick={handlePlayPause}>
        {isPlaying ? (
          <div className="flex items-center gap-2 ">
            <Img src={stopIcon} alt="Stop Button" width={40} height={30} />
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            <Img src={playIcon} alt="Play Button" width={40} height={30} />
          </div>
        )}
      </button>

    </div>
  );
};

export default LiveRadioButton;

