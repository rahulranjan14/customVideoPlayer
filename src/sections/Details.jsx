import React, { useContext } from "react";
import { VideoContext } from "../VideoContext";

const Details = () => {
  const { playlistData, setPlaylistData } = useContext(VideoContext);

  const activeMovie = playlistData?.movies?.filter((movie) => {
    if (movie.title == playlistData.activeMovie) {
      return movie;
    }
  });
  return (
    <div className="p-5 border-[#000] flex-col">
      {activeMovie && (
        <>
          <div className="flex flex-row">
            <div>
              <div className=" text-2xl font-bold">{activeMovie[0].title}</div>
              <div className="text-lg font-medium">
                {activeMovie[0].subtitle}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm font-light">{activeMovie[0].description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
