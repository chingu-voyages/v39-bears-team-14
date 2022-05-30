// import { useEffect, useRef } from 'react';
import React from 'react';

import styled from '@emotion/styled';

// import Webamp from 'webamp';

// import { initialTracks } from './config';

// function Winamp({ onClose, onMinimize }) {
//   const ref = useRef(null);
//   const webamp = useRef(null);
//   useEffect(() => {
//     const target = ref.current;
//     if (!target) {
//       return;
//     }
//     webamp.current = new Webamp({
//       initialTracks,
//     });
//     webamp.current.renderWhenReady(target).then(() => {
//       target.appendChild(document.querySelector('#webamp'));
//     });
//     return () => {
//       webamp.current.dispose();
//       webamp.current = null;
//     };
//   }, []);
//   useEffect(() => {
//     if (webamp.current) {
//       webamp.current.onClose(onClose);
//       webamp.current.onMinimize(onMinimize);
//     }
//   });
//   return (
//     <div
//       style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0 }}
//       ref={ref}
//     />
//   );
// }
function Winamp() {
  return <Div></Div>;
}
export default Winamp;
const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
