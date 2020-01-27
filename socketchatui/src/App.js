import React from 'react';
import Axios from 'axios'
import io from 'socket.io-client'
import './App.css';

function App() {

  const [message, setMessage] = React.useState([])
  const [userCount, setUserCount] = React.useState(0)
  const [inputData] = React.useState({
    nama:React.useRef(),
    message:React.useRef()
  })

  React.useEffect(()=>{
    const socket = io('http://localhost:2020');
    socket.on('chat message', updateMessage);//on adalah menerima 
    socket.on('user connected', updateUserCount);
    Axios.get(`http://localhost:2020/chat/getmessage`)
    .then((res)=>{
    setMessage(res.data)
    })
  },[])

  const updateMessage = (msgs) =>{
    setMessage(msgs)
  }

  const updateUserCount = (count) =>{
    setUserCount(count)
  }

  const onBtnSendClick = () =>{
    Axios.post('http://localhost:2020/chat/sendmessage', {
      nama: inputData.nama.current.value,
      message: inputData.message.current.value
    }).then((res)=>{
      console.log(res.data)
    })
  }

  const onBtnClearClick = () =>{
    Axios.delete('http://localhost:2020/chat/clearmessage')
    .then((res)=>{
      console.log(res.data)
    })
  }

  const renderListMessage = () =>{
    return message.map((item, index)=>{
      return (
        <tr key={index}>
          <td>{item.nama}</td>
          <td>{item.message}</td>
          <td></td>
        </tr>
      )
    })
  }



  return (
    <center>
      <h2>ChatGroup (User connected: {userCount})</h2>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Message</th>
            <th><input type="button" value="Clear" onClick={onBtnClearClick}/></th>
          </tr>
        </thead>
        <tbody>
          {renderListMessage()}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input type="text" ref={inputData.nama}/>
            </td>
            <td>
              <input type="text" ref={inputData.message}/>
            </td>
            <td>
              <input type="button" value="Send" onClick={onBtnSendClick}/>
            </td>
          </tr>
        </tfoot>
      </table>
    </center>
  );
}

export default App;
