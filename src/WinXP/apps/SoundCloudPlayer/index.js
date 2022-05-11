import { useState, useEffect, useMemo, useRef } from 'react';

import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  Favorite,
} from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
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

function getPreviousSongURL(songURL, songURLs) {
  const currIdx = songURLs.findIndex((url) => url === songURL);
  return songURLs.at(currIdx === 0 ? -1 : currIdx - 1);
}

function getNextSongURL(songURL, songURLs) {
  const currIdx = songURLs.findIndex((url) => url === songURL);
  return songURLs.at(currIdx === songURLs.length - 1 ? 0 : currIdx + 1);
}

export default function SoundCloudPlayer({ onClose }) {
  const songURLs = useMemo(
    () => [
      'https://soundcloud.com/poolhouseltd/vhs-dreams-meet-her-at-the-plaza',
      'https://soundcloud.com/eumigandchinon/pelle-g-childish-delight-eumig',
      'https://soundcloud.com/user-790028988/01-distant-dream-sleeping',
    ],
    [],
  );
  const [songURL, setSongURL] = useState(songURLs[0]); // song urls
  const [songTitle, setSongTitle] = useState(null);
  const [songArtist, setSongArtist] = useState(null);
  const [play, setPlay] = useState(false);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [songDuration, setSongDuration] = useState('-');

  const sc = useRef();

  useEffect(() => {
    async function getSCinfo(songURL) {
      const scUrl = `https://soundcloud.com/oembed.json?url=${songURL}`;
      const res = await fetch(scUrl);
      const data = await res.json();
      const [songTitle, songArtist] = data.title
        .split('by')
        .map((a) => a.trim());

      setSongTitle(songTitle);
      setSongArtist(songArtist);
    }
    getSCinfo(songURL);
  }, [songURL]);

  // Ensure that play/pause button state always matches soundcloud widget play/pause state
  if (document.getElementById('so')) {
    sc.current = window.SC.Widget('so');
  }
  if (sc.current) {
    const SC = sc.current;
    SC.getDuration(function (e) {
      setSongDuration(e);
    });
    SC.bind(window.SC.Widget.Events.PLAY, function () {
      setPlay(true);
    });
    SC.bind(window.SC.Widget.Events.PAUSE, function () {
      setPlay(false);
    });
    SC.bind(window.SC.Widget.Events.PLAY_PROGRESS, function (e) {
      setCurrentPosition(e.currentPosition);
    });
    SC.bind(window.SC.Widget.Events.FINISH, function () {
      setSongURL((songURL) => getNextSongURL(songURL, songURLs));
    });
    SC.bind(window.SC.Widget.Events.SEEK, function (e) {
      setCurrentPosition(e.currentPosition);
    });
  }

  return (
    <Div>
      <SongTitle title={songTitle} />
      <Artist name={songArtist} />
      {new Date(Math.round(currentPosition)).toISOString().substring(14, 19)}
      {' / '}
      {songDuration !== '-'
        ? new Date(Math.round(songDuration)).toISOString().substring(14, 19)
        : '-'}
      <Grid container justifyContent="center">
        <PreviousTrackButton
          onClick={() => {
            setPlay(true);
            setSongURL((songURL) => getPreviousSongURL(songURL, songURLs));
            setCurrentPosition(0);
            setSongDuration('-');
          }}
        />
        <PlayPauseButton
          play={play}
          onClick={() => {
            if (sc.current) {
              const SC = sc.current;
              if (play) {
                SC.pause();
              } else {
                SC.play();
              }
              setPlay((status) => !status);
            }
          }}
        />
        <NextTrackButton
          onClick={() => {
            setPlay(true);
            setSongURL((songURL) => getNextSongURL(songURL, songURLs));
            setCurrentPosition(0);
            setSongDuration('-');
          }}
        />
        <FavouriteButton
          onClick={() => {
            console.log('favourite button pressed!');
          }}
        />
      </Grid>
      <div id="player" hidden>
        <iframe
          title="so"
          id={'so'}
          width="100%"
          height="100%"
          scrolling="no"
          frameBorder="0"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${songURL}&auto_play=true`}
        >
          Loading
        </iframe>
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
