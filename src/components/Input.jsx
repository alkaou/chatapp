import attachfile from '../images/attachfile.png'
import attachimg from '../images/attachimg.png'
import { useState, useContext, useRef } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { doc, onSnapshot, serverTimestamp, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { BiImageAdd } from 'react-icons/bi'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import { BsSend } from 'react-icons/bs'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const Input = () => {
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordTime, setRecordTime] = useState('00:00:00')
  const [isRunning, setIsRunning] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null);

  const [img, setImg] = useState(null)

  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const startTime = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorder = useRef(null);

  function startTimer() {
    setIsRunning(true);
    startTime.current = new Date().getTime();
    intervalRef.current = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime.current;
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
      const milliseconds = Math.floor((elapsed % 1000) / 10);
      setRecordTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`);
    }, 10);
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }

  // Vérifier l'état de la permission
  const checkMicrophone = async () => {
    await navigator.permissions.query({name:'microphone'}).then(permissionStatus => {
      // console.log('Permission status:', permissionStatus.state);
      if (permissionStatus.state === 'granted') {
        setRecording(true);
        startTimer();
      } else {
        alert("Vous avez bloqué l'accès à la micro. Veuillez le débloquer svp.");
        // return false;
      }
    });
  }

  const startRecording = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.current.start();
      })
      .catch(err => console.log(err));
    checkMicrophone();
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
  };

  const handleDataAvailable = async (event) => {
    setAudioBlob(event.data);
    if (event.data.size > 0) {
      const voice_vocal = new Blob([event.data], { type: 'audio/webm' });

      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, voice_vocal)

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL)
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: '',
                senderId: currentUser.uid,
                date: Timestamp.now(),
                voice_vocal: downloadURL,
              }),
            })
          })
        },
      )

      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          text: '',
        },
        [data.chatId + '.date']: serverTimestamp(),
      })

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          text: '',
        },
        [data.chatId + '.date']: serverTimestamp(),
      })

    }
  };

  // const playAudio = () => {
  //   const audioURL = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioURL);
  //   audio.play();
  // };

  const handleRecordVoice = async () => {
    if(recording === false){
      await startRecording();
    } else {
      stopRecording();
      stopTimer();
      setRecording(false);
      setRecordTime('00:00:00');
      // console.log(audioBlob);
    }
  }

  const handleSend = async () => {

    // if(audioBlob !== null) playAudio();

    // if nothing text is write in message input
    if (text.trim() === '' && !img) return;
    setText('');
    
    if (img) {
      const storageRef = ref(storage, uuid())

      const uploadTask = uploadBytesResumable(storageRef, img)

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL)
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            })
          })
        },
      )
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      })
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })

    setText('')
    setImg(null)
  }
  return (
    <div className='input' >
      {
        data.chatId === "null" ? null : (
          <>
            {recording === false ?
              <input value={text} onChange={(e) => setText(e.target.value)} type='text' placeholder='Write something...' />
              :
              (
                <div className='input recordTime'>
                  <span></span> {recordTime}
                </div>
              )
            }
            <div className='send'>
              {recording === false ?
                <>
                  <i className='pointer'>
                    <ImAttachment size={24} color='#00000090' />
                  </i>

                  <label htmlFor='img'>
                    <i className='pointer'>
                      <BiImageAdd size={24} color='#00000090' />
                    </i>
                  </label>
                  <input onChange={(e) => setImg(e.target.files[0])} type='file' id='img' style={{ display: 'none' }} />

                  <button onClick={handleSend}>
                    <i className='pointer'>
                      <BsSend size={24} color='#00000090' />
                    </i>
                  </button>

                </> : null
              }
              <button onClick={handleRecordVoice}>
                <i className='pointer'>
                  { recording === true ?
                    <FaMicrophone size={24} color='blue' />
                    :
                    <FaMicrophoneSlash size={30} color='#00000090' />
                  }
                </i>
              </button>
            </div>
          </>
        )
      }
    </div>
  )
}


export default Input
