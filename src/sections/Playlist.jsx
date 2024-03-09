import React, { useEffect, useState, useContext } from "react";

import MoviesList from "./../../movies.json";
import { VideoContext } from "../VideoContext";

const Playlist = () => {
  const { playlistData, setPlaylistData } = useContext(VideoContext);

  const [dragId, setDragId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // console.log("movcate", MoviesList.categories[0].videos);
    let mov = MoviesList.categories[0].videos.map((movie, index) => {
      movie.movieOrder = index;
      movie.initialOrder = index;
      return movie;
    });

    let playlistDataTemp = { ...playlistData };
    playlistDataTemp.movies = mov;
    playlistDataTemp.activeMovie = mov[0].title;
    setPlaylistData(playlistDataTemp);
  }, []);

  const handleDrag = (ev) => {
    // console.log("handledrag", ev.currentTarget.id);
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    // console.log("handledrop", ev.currentTarget.id);
    if (dragId) {
      const dragBox = playlistData?.movies.find(
        (movie) => movie.title == dragId
      );

      const dropBox = playlistData?.movies.find(
        (movie) => movie.title == ev.currentTarget.id
      );

      const dragBoxOrder = dragBox.movieOrder;
      const dropBoxOrder = dropBox.movieOrder;

      const newBoxState = playlistData?.movies.map((movie) => {
        if (movie.title === dragId) {
          movie.movieOrder = dropBoxOrder;
        } else if (movie.title === ev.currentTarget.id) {
          if (dragBoxOrder < dropBoxOrder) {
            movie.movieOrder = dropBoxOrder - 1;
          } else {
            movie.movieOrder = dropBoxOrder + 1;
          }
        } else if (
          dragBoxOrder < dropBoxOrder &&
          movie.movieOrder > dragBoxOrder &&
          movie.movieOrder <= dropBoxOrder
        ) {
          movie.movieOrder = movie.movieOrder - 1;
        } else if (
          dragBoxOrder > dropBoxOrder &&
          movie.movieOrder >= dropBoxOrder &&
          movie.movieOrder < dragBoxOrder
        ) {
          movie.movieOrder = movie.movieOrder + 1;
        }
        return movie;
      });

      //   console.log("nbs", newBoxState);

      let playlistDataTemp = { ...playlistData };
      playlistDataTemp.movies = newBoxState;
      setPlaylistData(playlistDataTemp);
    }
  };

  const changeActiveMovie = (activeMovietitle) => {
    let playlistDataTemp = { ...playlistData };

    playlistDataTemp.activeMovie = activeMovietitle;
    setPlaylistData(playlistDataTemp);
  };

  return (
    <div className="text-center  px-5 pb-2">
      <div className="my-5 text-2xl font-bold">Movies</div>

      <div className="">
        <input
          placeholder="Search"
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-5 py-2 rounded-md border-2  border-slate-900"
        />
      </div>

      <div>
        <div className="text-left mt-5">More in this playlist</div>
        <div className="text-xs font-thin text-left">
          You can drag and drop to reorder the playlist
        </div>
        <div className="mt-2 max-h-[70vh] overflow-y-scroll border-2 px-2 py-2 border-slate-400 rounded">
          {playlistData?.movies
            ?.sort((a, b) => a?.movieOrder - b?.movieOrder)
            .filter((movie) => {
              if (searchKeyword != "") {
                if (
                  movie?.title
                    ?.toLowerCase()
                    .includes(searchKeyword.toLowerCase()) ||
                  movie?.subtile
                    ?.toLowerCase()
                    .includes(searchKeyword.toLocaleLowerCase()) ||
                  movie?.description
                    ?.toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                ) {
                  return movie;
                }
              } else {
                return movie;
              }
            })
            .map((movie, index) => {
              return (
                <div
                  draggable={true}
                  id={movie.title}
                  onDragOver={(e) => e.preventDefault()}
                  onDragStart={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => changeActiveMovie(movie.title)}
                  className={` flex flex-row px-2 py-2 my-2 rounded ${
                    movie.title === playlistData.activeMovie
                      ? "bg-gray-400 border-2 border-gray-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div className="w-20 flex items-center justify-center">
                    <video className="rounded">
                      <source src={`${movie.sources[0]}#t=2.5`} />
                    </video>
                  </div>
                  <div className="w-60 text-left px-2">
                    <div className="font-semibold text-medium">
                      {movie.title}
                    </div>
                    <div className="font-medium text-xs">{movie.subtitle}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
