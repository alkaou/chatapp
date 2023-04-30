import { useContext } from 'react'
import add from '../images/add.png'
import { AiOutlinePoweroff } from 'react-icons/ai'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { AuthContext } from '../context/AuthContext'
import { IoIosOptions } from 'react-icons/io'
const Navbar = () => {
  const { currentUser } = useContext(AuthContext)

  const openChatsBar = () => {
    const sideBar = document.querySelector('.sidebar')
    sideBar.classList.toggle('toggleSideBar')
    console.log(sideBar)
  }
  return (
    <div className='navbar'>
      <p className='logo'>Dev Chat</p>
      <div className='user'>
        <img className='pointer' src={currentUser.photoURL} />
        <p className='pointer'>{currentUser.displayName}</p>
      </div>
      <button className='pointer' onClick={() => signOut(auth)}>
        <i>
          <AiOutlinePoweroff size={24} color='#ff00a6' />
        </i>
      </button>
      <i onClick={openChatsBar}>
        <IoIosOptions size={24} color='white' />
      </i>
    </div>
  )
}

export default Navbar
