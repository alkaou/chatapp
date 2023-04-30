import { useContext } from 'react'
import { FaBeer } from 'react-icons/fa'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { BsThreeDots, BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import camera from '../images/camera.png'
import add from '../images/add.png'
import dots from '../images/dots.png'
import { Messages, Input } from './'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  const { data } = useContext(ChatContext)

  const openChatsBar = () => {
    const sideBar = document.querySelector('.sidebar')
    sideBar.classList.toggle('toggleSideBar')
  }

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <div className='chatTopNavUserInfo'>
          <i onClick={openChatsBar} className='openChatsBarBtn pointer' src={dots} alt=''>
            <IoIosOptions size={24} color='#00000090' />
          </i>
          <img className='chatTopNavUserDisplayImg pointer' src={data.user?.photoURL} alt='' />
          <span className='chatTopNavUserDisplayName pointer'>{data.user?.displayName}</span>
        </div>
        <div className='chatIcons'>
          <i className='pointer'>
            <BsCamera size={24} color='#00000090' />
          </i>
          <i className='pointer'>
            <AiOutlineUserAdd size={24} color='#00000090' />
          </i>
          <i className='pointer'>
            <BsThreeDots size={24} color='#00000090' />
          </i>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
