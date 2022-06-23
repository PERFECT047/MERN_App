import ChatHeader from './ChatHeader'
import MatchDisplay from './MatchDisplay'
import ChatDisplay from './ChatDisplay'
import { useState } from 'react'

const ChatContainer = ({user}) => {

    const [clickedUser, setClickedUser] = useState(null)

    return (
        <div className="chat-container">
            <ChatHeader user = {user}/>

            <div>
                <button className="option" onClick={() => setClickedUser(null)}>Matches</button>
                <button className="option" disabled={!clickedUser}>Chat</button>
            </div>

            {!clickedUser && <MatchDisplay matches={user.matches} setClickedUser={setClickedUser}/>}

            {clickedUser && <ChatDisplay/>}
        </div>
    )
}

export default ChatContainer