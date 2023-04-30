import { useState, useEffect, useContext } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data())
      })
      return () => {
        unsub()
      }
    }
    currentUser.uid && getChats()
    // console.log(chats);
  }, [currentUser.uid])

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u })
  }
  return (
    <div className='chats'>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          return (
            <div className='chatUserInfo' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
              <img src={chat[1].userInfo.photoURL} />
              <div>
                <span>{chat[1].userInfo.displayName}</span>
                {
                  chat[1].lastMessage.text === "" ? <p>vocal</p> 
                  : 
                  <p>
                    {
                      chat[1].lastMessage.text.length > 15 ? 
                        chat[1].lastMessage.text.substring(0, 15) + '...' :
                        chat[1].lastMessage.text
                    }
                  </p>
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
export default Chats
