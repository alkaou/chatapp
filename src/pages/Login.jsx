import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target[0].value
    const password = e.target[1].value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (e) {
      console.log(e)
      setError(true)
    }
  }
  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <p className='logo'>Dev Chat</p>
        <p className='title'>Login</p>
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='Your email' />
          <input type='password' placeholder='Your password' />
          <button>Sign in</button>
          <p className='condition'>
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
