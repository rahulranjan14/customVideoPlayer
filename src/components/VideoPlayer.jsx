import React, { useState, useRef, useContext } from "react";
import { VideoContext } from "../VideoContext";

const VideoPlayer = () => {
  const { playlistData, setPlaylistData } = useContext(VideoContext);

  const activeMovie = playlistData?.movies?.filter((movie) => {
    if (movie.title == playlistData.activeMovie) {
      return movie;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef(null);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (time) => {
    videoRef.current.currentTime += time;
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  const toggleAutoplay = () => {
    setIsAutoplayEnabled(!isAutoplayEnabled);

    handleAutoplayLogic();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(videoRef.current.duration);
  };

  const handleProgressBarClick = (e) => {
    const clickedTime =
      (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    videoRef.current.currentTime = clickedTime;
    setCurrentTime(clickedTime);
  };

  const handleVideoEnd = () => {
    let playlistDataTemp = { ...playlistData };
    let currentMovieIndex;
    playlistDataTemp.movies.map((movie, index) => {
      if (movie.title == playlistDataTemp.activeMovie) {
        currentMovieIndex = index;
      }
    });

    let activeMovieTemp;
    if (currentMovieIndex + 1 == playlistDataTemp.movies.length) {
      activeMovieTemp = playlistDataTemp.movies[0].title;
    } else {
      activeMovieTemp = playlistDataTemp.movies[currentMovieIndex + 1].title;
    }

    playlistDataTemp.activeMovie = activeMovieTemp;
    setPlaylistData(playlistDataTemp);

    // console.log("Video ended", currentMovieIndex, activeMovieTemp);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // console.log("am", activeMovie);

  if (activeMovie && activeMovie[0])
    return (
      <div
        style={{ position: "relative", width: "100%" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={activeMovie[0]?.sources[0]}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          style={{ width: "100%", height: "auto" }}
          autoPlay={isAutoplayEnabled}
          muted
          playbackRate={speed}
          onEnded={() => {
            setIsPlaying(false);
            handleVideoEnd();
          }}
        ></video>

        {isHovered && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <button
                className="mx-1 border px-1 opacity-50 text-xs font-thin"
                onClick={togglePlayPause}
              >
                {isPlaying ? "Playing" : "Paused"}
              </button>
              <button
                className="mx-1 border px-1 opacity-50 text-xs font-thin"
                onClick={toggleMute}
              >
                {isMuted ? "Muted" : "Unmuted"}
              </button>
              <button
                className="mx-1 border px-1 opacity-50 text-xs font-thin"
                onClick={toggleAutoplay}
              >
                {isAutoplayEnabled ? (
                  <span className="">Autoplay on</span>
                ) : (
                  <span className="">Autoplay off</span>
                )}
              </button>
            </span>
            <div>
              <span className="mx-2">
                <button
                  className="border px-1 opacity-50 mx-0.5 text-xs font-thin"
                  onClick={() => handleSpeedChange(0.5)}
                >
                  0.5x
                </button>
                <button
                  className="border px-1 opacity-50 mx-0.5 text-xs font-thin"
                  onClick={() => handleSpeedChange(1)}
                >
                  1x
                </button>
                <button
                  className="border px-1 opacity-50 mx-0.5 text-xs font-thin"
                  onClick={() => handleSpeedChange(1.5)}
                >
                  1.5x
                </button>
                <button
                  className="border px-1 opacity-50 mx-0.5 text-xs font-thin"
                  onClick={() => handleSpeedChange(2)}
                >
                  2x
                </button>
              </span>
            </div>

            <div>
              <span className="mx-2">
                <button
                  className="mx-1 border px-1 font-thin text-xs opacity-50"
                  onClick={() => handleSeek(-10)}
                >
                  {"-10"}
                </button>

                <button
                  className="mx-1 border px-1 font-thin text-xs opacity-50"
                  onClick={() => handleSeek(10)}
                >
                  {"+10"}
                </button>
              </span>
              <span className="mx-1 font-medium text-xs opacity-75">
                {formatTime(currentTime)} / {formatTime(duration)}{" "}
              </span>
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            position: "relative",
            marginTop: "0px",
            cursor: "pointer",
          }}
          onClick={handleProgressBarClick}
        >
          <div
            style={{
              position: "absolute",
              height: "5px",
              backgroundColor: "gray",
              width: "100%",
              top: "50%",
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "100%",
                backgroundColor: "red",
                width: `${(currentTime / duration) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
};

export default VideoPlayer;
