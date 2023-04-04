import React, { useEffect, useRef, useState } from 'react'
import styles from './EditorPage.module.css'
import img from '../images/code-sync.png'
import toast from 'react-hot-toast';
import Client from '../components/Client'
import Editor from '../components/Editor'
import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [location.state?.username, reactNavigator, roomId]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className={styles.editorPageWrapper}>
        <div className={styles.flexWrapper}>
          <div className={styles.item} id={styles.item1}>
            <div className={styles.smallFlexWrapper}>
              <div className={styles.smallItem} id={styles.smallItem1}>
                <img src={img} alt="code-sync-logo" />
              </div>
              <div className={styles.smallItem} id={styles.smallItem2}>
                <div className={styles.firstFlexHead}>Code Editor</div>
                <div className={styles.secondFlexHead}>Realtime Collaboration</div>
              </div>
            </div>
            <hr />
            <div className={styles.connectedHead}>Connected</div>
            <div className={styles.connectedUsers}>
              {
                clients.map((client) => (
                  <Client username={client.username} key={client.socketId} />
                ))}
            </div>
            <button className={styles.copyRoomIdBtn} onClick={copyRoomId}>Copy Room ID</button>
            <button className={styles.leaveBtn} onClick={leaveRoom}>Leave</button>
          </div>
          <div className={styles.item} id={styles.item2}>
            <Editor socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                console.log(code)
                codeRef.current = code;
              }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default EditorPage