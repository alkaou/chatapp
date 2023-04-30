import { useContext, useEffect, useState } from 'react'
import { Message } from './'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot, exists } from 'firebase/firestore'
import { db } from '../firebase'

const Messages = () => {
  const { data } = useContext(ChatContext)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })
    return () => {
      unSub()
    }
  }, [data.chatId])

  const closeChatsBar = () => {
    const sideBar = document.querySelector('.sidebar')
    if (sideBar.classList.contains('toggleSideBar')) {
      sideBar.classList.remove('toggleSideBar')
    } else return
  }
  return (
    <div onClick={closeChatsBar} className='messages'>
      {messages.map((m) => {
        return <Message message={m} key={m.id} />
      })}
    </div>
  )
}
export default Messages
