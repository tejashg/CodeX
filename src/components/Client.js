import React from 'react'
import styles from './Client.module.css'
import Avatar from 'react-avatar';

const Client = ({username}) => {
  return (
    <div className={styles.Client}>
        <Avatar name={username} size={40} round="8px" />
        <div className={styles.userName}>{username}</div>
    </div>
  )
}

export default Client