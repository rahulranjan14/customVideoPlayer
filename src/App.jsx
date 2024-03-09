import { useState } from "react";
import "./App.css";

import PlayerSection from "./sections/PlayerSection";
import Details from "./sections/Details";
import Playlist from "./sections/Playlist";

import { VideoContext } from "./VideoContext";

const App = () => {
  const [playlistData, setPlaylistData] = useState("");

  const [count, setCount] = useState(0);

  return (
    <div>
      <VideoContext.Provider value={{ playlistData, setPlaylistData }}>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-8/12 ps-2 pt-2">
            <div>
              <PlayerSection />
            </div>
            <div>
              <Details />
            </div>
          </div>

          <div className="w-full sm:w-4/12">
            <Playlist />
          </div>
        </div>
      </VideoContext.Provider>
    </div>
  );
};

export default App;
