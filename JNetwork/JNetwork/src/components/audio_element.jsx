import { useState, useEffect, useRef } from "react";
import { IoMic } from "react-icons/io5";
import "./styles/audio_element.css";



function AudioElement(audioUrl) {

  // Ref to the audio/video/screen record to get its duration
  const mediaEl = useRef(null);
  // Store the durations in here
  const [mediaDuration, setMediaDuration] = useState(0);
  const [mediaCurrentTimestamp, setMediaCurrentTimestamp] = useState(0);


  let intervalID;



  const getDuration = () => {
    const media = mediaEl.current;
    setMediaCurrentTimestamp(0);

    if (!media)
      return;
    setMediaDuration(Math.round(media.duration));
    console.log(`Le media dure ${mediaDuration} secondes.`);
  };



  {/* When playing, update the current time every second */}
  const handleSliderPlay = async () => {
    const media = mediaEl.current;


    if (intervalID)
      clearInterval(intervalID);

    {/* We do it once before the interval to show the "0" timestamp */}
//    setMediaCurrentTimestamp(Math.round(media.currentTime));
    intervalID = setInterval(() => {
      console.log("hop");
      console.log(intervalID)
      setMediaCurrentTimestamp(Math.round(media.currentTime));
    }, 1000);
  }

  /* Stop the interval to stop the current timer to update */
  const handleSliderPause = () => {
    console.log("stop")
    console.log(intervalID)
    clearInterval(intervalID);
  }

  const handleMediaEnd = () => {
    console.log("C'est fini!")
    clearInterval(intervalID);
  }


  /*  Called when manually changing the input[range] value
      to set the audio at a precise time
  */
  const setAudioTimestamp = (e) => {
    const media = mediaEl.current;
    media.currentTime = e.target.value;
    console.log(e.target.value);
  };

	return (
    <div id="audio-elemnent">
      {/* Designed audio tag */}
  		<div className="step-two-audio-record">

        <audio key={audioUrl.source} controls ref={mediaEl}
            onLoadedMetadata={getDuration}
            onPlay={() => handleSliderPlay()}
            onPause={() => handleSliderPause()}
            onEnded={() => handleMediaEnd()}
        >
          <source src={audioUrl.source} />
        </audio>

        <IoMic />
      </div>

      {/* Slide seeker, to follow and change the audio time */}
      <input type="range" name="seek-slider" min="0" max={mediaDuration}
          value={mediaCurrentTimestamp}
          onChange={(e) => setAudioTimestamp(e)} />
      {/* Display audio time & total duration */}
      <span>{mediaCurrentTimestamp} / {mediaDuration}</span>
    </div>
	);
}


export default AudioElement;