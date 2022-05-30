import { useState, useEffect, useRef, useContext } from 'react';

import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { SessionContext } from 'App';
import loadscript from 'load-script';
import styled from 'styled-components';
import { supabase } from 'supabaseClient';

function SongTitle({ title }) {
  return (
    <p>
      <b>Title:</b> {title}
    </p>
  );
}

function Artist({ name }) {
  return (
    <p>
      <b>Artist:</b> {name}
    </p>
  );
}

function PreviousTrackButton({ onClick }) {
  return (
    <Button variant="contained" onClick={onClick} disableRipple color="info">
      <SkipPrevious />
    </Button>
  );
}

function PlayPauseButton({ onClick, play }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disableRipple
      color={play ? 'warning' : 'secondary'}
    >
      {play ? <Pause /> : <PlayArrow />}
    </Button>
  );
}

function NextTrackButton({ onClick }) {
  return (
    <Button variant="contained" onClick={onClick} disableRipple color="info">
      <SkipNext />
    </Button>
  );
}

function FavouriteButton({ disabled, onClick, color, selected }) {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      disableRipple
      color={color}
    >
      {disabled || selected ? <Favorite /> : <FavoriteBorder />}
    </Button>
  );
}

export default function SoundCloudPlayer() {
  const [session] = useContext(SessionContext);

  const [songTitle, setSongTitle] = useState(null);
  const [songArtist, setSongArtist] = useState(null);
  const [songURL, setSongURL] = useState(null);
  const [songID, setSongID] = useState(null);
  const [songPosition, setSongPosition] = useState(0);
  const [songDuration, setSongDuration] = useState('-');
  const [songInFavourites, setSongInFavourites] = useState(false);

  // used to communicate between SC widget and React
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState(false);
  // ref for iframe element - https://reactjs.org/docs/refs-and-the-dom.html
  const iframeRef = useRef();

  // initialization - load soundcloud widget API and set SC event listeners

  useEffect(() => {
    // use load-script module to load SC Widget API
    loadscript('https://w.soundcloud.com/player/api.js', () => {
      // initialize player and store reference in state
      const player = window.SC.Widget(iframeRef.current);
      setPlayer(player);
      const { PLAY, PLAY_PROGRESS, PAUSE } = window.SC.Widget.Events;

      // NOTE: closures created - cannot access react state or props from within and SC callback functions!!

      player.bind(PLAY_PROGRESS, (e) => {
        player.getDuration((duration) => {
          setSongDuration(duration);
        });
        setSongPosition(e.currentPosition);
        player.getCurrentSound((currentSound) => {
          setSongTitle(currentSound.title);
          setSongArtist(currentSound.user.username);
          setSongURL(currentSound.permalink_url);
        });
      });

      player.bind(PLAY, () => {
        // update state to playing
        setIsPlaying(true);
        // check to see if song has changed - if so update state with next index
        player.getCurrentSoundIndex((playerPlaylistIndex) => {
          setPlaylistIndex(playerPlaylistIndex);
        });
      });

      player.bind(PAUSE, () => {
        // update state if player has paused - must double check isPaused since false positives
        player.isPaused((playerIsPaused) => {
          if (playerIsPaused) setIsPlaying(false);
        });
      });
    });
  }, []);

  // integration - update SC player based on new state (e.g. play button in React section was click)

  // adjust playback in SC player to match isPlaying state
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.isPaused((playerIsPaused) => {
      if (isPlaying && playerIsPaused) {
        player.play();
      } else if (!isPlaying && !playerIsPaused) {
        player.pause();
      }
    });
  }, [player, isPlaying]);

  // adjust seleted song in SC player playlist if playlistIndex state has changed
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available
    player.getCurrentSoundIndex((playerPlaylistIndex) => {
      if (playerPlaylistIndex !== playlistIndex) player.skip(playlistIndex);
    });
  }, [player, playlistIndex]);

  useEffect(() => {
    async function fetchSongID() {
      if (songURL === null || !supabase.auth.user()) {
        return;
      }

      const { data: songData, songDataError } = await supabase
        .from('songs')
        .select('song_id')
        .eq('soundcloud_url', songURL);
      if (songDataError || !songData.length) {
        return;
      }
      setSongID(songData[0].song_id);
      // Check if song already exists in user's favourites
      const { data: favouriteSongData, favouriteSongDataError } = await supabase
        .from('profiles_songs')
        .select('song_id')
        .eq('profile_id', supabase.auth.user().id)
        .eq('song_id', songData[0].song_id);

      if (favouriteSongDataError) {
        return;
      }

      setSongInFavourites(favouriteSongData.length > 0);
    }
    fetchSongID();
  }, [songURL, songID, session]);

  // React section button click event handlers (play/next/previous)
  //  - adjust React component state based on click events

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaylistIndex = (skipForward = true) => {
    // get list of songs from SC widget
    player.getSounds((playerSongList) => {
      player.seekTo(0);
      // Stay on same track if rewinding with more than 2 seconds of elapsed playback
      if (!skipForward && songPosition > 2000) {
        return;
      }

      let nextIndex = skipForward ? playlistIndex + 1 : playlistIndex - 1;
      // ensure index is not set to less than 0 or greater than playlist
      if (nextIndex < 0) {
        nextIndex = playerSongList.length - 1;
      } else if (nextIndex >= playerSongList.length) {
        nextIndex = 0;
      }
      setPlaylistIndex(nextIndex);
    });
  };

  return (
    <Div>
      <iframe
        title="so"
        hidden
        ref={iframeRef}
        id="sound-cloud-player"
        style={{ border: 'none', height: 314, width: 400 }}
        scrolling="no"
        allow="autoplay"
        src={
          'https://w.soundcloud.com/player/?url=https://soundcloud.com/user-770890652/sets/player-demo'
        }
      ></iframe>
      <div>
        <SongTitle title={songTitle} />
        <Artist name={songArtist} />
        <p>
          {new Date(Math.round(songPosition)).toISOString().substring(14, 19)} /{' '}
          {songDuration !== '-'
            ? new Date(Math.round(songDuration)).toISOString().substring(14, 19)
            : '-'}
        </p>

        <Grid container justifyContent="center">
          <PreviousTrackButton onClick={() => changePlaylistIndex(false)} />
          <PlayPauseButton play={isPlaying} onClick={togglePlayback} />
          <NextTrackButton onClick={() => changePlaylistIndex(true)} />
          <FavouriteButton
            disabled={songTitle === null || !supabase.auth.user()}
            selected={songInFavourites}
            color={'error'}
            onClick={async () => {
              // Add song to user's favourites if not exists
              if (!songInFavourites) {
                const { error } = await supabase.from('profiles_songs').insert([
                  {
                    song_id: songID,
                    profile_id: supabase.auth.user().id,
                  },
                ]);
                if (!error) {
                  setSongInFavourites(true);
                }
              } else {
                // Otherwise, remove song from favourites
                const { error } = await supabase
                  .from('profiles_songs')
                  .delete()
                  .eq('profile_id', supabase.auth.user().id)
                  .eq('song_id', songID);
                if (!error) {
                  setSongInFavourites(false);
                }
              }
            }}
          />
        </Grid>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
