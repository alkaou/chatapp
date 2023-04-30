import { useEffect, useState, useRef, useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const Message = ({ message }) => {
  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  const closeChatsBar = () => {
    const sideBar = document.querySelector('.sidebar')
    sideBar.classList.remove('toggleSideBar')
  }
  return (
    <div onClick={closeChatsBar} ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className='messageInfo'>
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} />
        <p>3:46 MP</p>
      </div>
      <div className='messageContent'>
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} />}
        {message.voice_vocal && <audio src={message.voice_vocal} controls />}
      </div>
    </div>
  )
}
export default Message
