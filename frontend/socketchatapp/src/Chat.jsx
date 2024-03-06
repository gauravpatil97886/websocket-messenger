import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import './assets/chat.css'

let socket;

function Chat() {

    const [name, setName] = useState('');
    const [room, setRoom] = useState(''); // room id
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const location = useLocation();

    const ENDPOINT = "http://localhost:3001";

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket = io(ENDPOINT);

        // we will trigger an event to join a room
        socket.emit('joinRoom', { name, room }, (error) => {
            if(error) {
                console.log(error);  // if no error then we r connected
            }
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [location.search]);

    useEffect(() => {
        // Set up message listener only once
        socket.on('newmessageInTheRoom', (details) => {
            setMessageList(msgList => [...msgList, details]);
        });

        // Clean up the message listener on component unmount
        return () => {
            socket.off('newmessageInTheRoom');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if(message) {
            socket.emit('newMessage', message, () => setMessage(''));
        }
    }

    return (
        <div>
            Chat App {room} : {name}

            <div>
                {messageList.map((msg, i) => <div key={i}>{msg.user} : {msg.text}</div>)}
            </div>

            <input 
                placeholder='Write your msg...'
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage(e) : null}
                value={message}
            />
        </div>
    )
}

export default Chat;
