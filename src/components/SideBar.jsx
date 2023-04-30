import { Navbar, Search, Chats } from './'

const SideBar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <Chats />
    </div>
  )
}

export default SideBar
