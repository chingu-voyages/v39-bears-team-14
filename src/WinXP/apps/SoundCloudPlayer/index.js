import { useState, useEffect, useRef } from 'react';

import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  Favorite,
} from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import loadscript from 'load-script';
import styled from 'styled-components';

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

function FavouriteButton({ onClick }) {
  return (
    <Button variant="contained" onClick={onClick} disableRipple color="info">
      <Favorite />
    </Button>
  );
}

export default function SoundCloudPlayer({ onClose }) {
  const [songTitle, setSongTitle] = useState(null);
  const [songArtist, setSongArtist] = useState(null);
  const [songPosition, setSongPosition] = useState(0);
  const [songDuration, setSongDuration] = useState('-');

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

  // React section button click event handlers (play/next/previous)
  //  - adjust React component state based on click events

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaylistIndex = (skipForward = true) => {
    // get list of songs from SC widget
    player.getSounds((playerSongList) => {
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
            onClick={() => {
              console.log('favourite button pressed!');
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
