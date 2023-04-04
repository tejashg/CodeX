import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import styles from './Home.module.css'
import img from '../images/code-sync.png'

const Home = () => {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')

  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuidV4()
    setRoomId(id)
    toast.success('Created a new room', {
      iconTheme: {
        primary: '#6fdcdc'
      }
    })
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Room ID & Username is required', {
        iconTheme: {
          primary: '#000000'
        }
      })
      return
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username
      }
    })
  }

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom()
    }
  }

  const [MousePosition, setMousePosition] = useState({
    left: 0,
    top: 0
  })

  const handleMouseMove = (e) => {
    setMousePosition({ left: e.pageX, top: e.pageY })
  }

  return (
    <div className={styles.homePageWrapper} onMouseMove={(e) => handleMouseMove(e)}
      style={{ backgroundPositionX: MousePosition.left, backgroundPositionY: MousePosition.top }}>
      <div className={styles.formWrapper}>
        <div className={styles.flexWrapper}>
          <div className={styles.item} id={styles.item1}><img src={img} alt="code-sync-logo" /></div>
          <div className={styles.item} id={styles.item2}>
            <div className={styles.head1}>Code Editor</div>
            <div className={styles.head2}>Realtime Collaboration</div>
          </div>
        </div>
        <div className={styles.inputWrapper}>
          <input className={styles.roomIDWrapper} type="text" placeholder='&nbsp;&nbsp;ROOM ID' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} onKeyUp={handleInputEnter} />
          <input className={styles.usernameWrapper} type="text" placeholder='&nbsp;&nbsp;USERNAME' value={username} onChange={(e) => { setUsername(e.target.value) }} onKeyUp={handleInputEnter} />
          <button className={styles.joinButton} onClick={joinRoom}>Join</button>
        </div>
        <footer className={styles.lastFormFooter}>
          If you don't have an invite then create &nbsp;<a href="/" onClick={createNewRoom}>new room</a>
        </footer>
      </div>
      <footer className={styles.lastFooterHead}>Built with 💙 by &nbsp;
        <a href="https://github.com/tejashg" target='_blank' rel="noreferrer">Tejash Gupta</a></footer>
    </div>
  )
}

export default Home