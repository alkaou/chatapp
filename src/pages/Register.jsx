import { useState } from 'react'
import addprofile from '../images/addprofile.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    // Check if file exists
    if (!file) {
      setError(true)
      return
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const storageRef = ref(storage, displayName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress
        },
        (error) => {
          setError(true)
          console.log(error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            })

            // Add a new document in collection "users"
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            })

            await setDoc(doc(db, 'userChats', res.user.uid), {})
            navigate('/')
          })
        },
      )
    } catch (e) {
      setError(true)
      console.log(e)
    }
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <p className='logo'>Dev Chat</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p className='title'>Register</p>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='Your name' />
          <input type='email' placeholder='Your email' />
          <input type='password' placeholder='Your password' />
          <input style={{ display: 'none' }} type='file' placeholder='Your profile image' id='file' />
          <label htmlFor='file'>
            <img src={addprofile} /> <span>Add image</span>
          </label>
          <button>Sign up</button>
          <p className='condition'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
