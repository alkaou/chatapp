import { useState, useContext } from 'react'
import {
  collection,
  query,
  updateDoc,
  setDoc,
  where,
  getDocs,
  getDoc,
  exists,
  serverTimestamp,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState()
  const [error, setError] = useState('')
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  const handleSearch = async () => {
    try {
      const q = query(collection(db, 'users'), where('displayName', '==', username))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      })
    } catch (e) {
      setError(true)
      console.log(e)
    }
  }

  const handleKey = (e) => {
    if (e.keyCode === 13) {
      handleSearch()
    } else {
    }
  }

  const handleSelect = async (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u })
    //check whether the group(chats in firestore) exists, if not create
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] })

        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })
      }
    } catch (err) {}
    setUser(null)
    setUsername('')
  }

  return (
    <div className='search'>
      <div className='searchForm'>
        {error && <p>{error}</p>}
        <input
          value={username}
          enterKeyHint='search'
          placeholder='Find a user'
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {user && (
        <div onClick={() => handleSelect(user)} className='chatSearchUserInfo'>
          <img src={user.photoURL} />
          <span>{user.displayName}</span>
        </div>
      )}
    </div>
  )
}

export default Search
