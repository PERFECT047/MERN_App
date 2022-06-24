import Chat from "./Chat"
import ChatInput from "./ChatInput"
import axios from "axios"
import { useEffect, useState } from "react"

const ChatDisplay = ({user, clickedUser}) => {

    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const getUsersMessages = async () => {

        try {

            const response = await axios.get('http://localhost:8000/messages',{
            params: {userId: userId, correspondingUserId: clickedUserId }
            })
            setUsersMessages(response.data)

        } catch (err){
            console.log(err)
        }

    }

    const getClickedUsersMessages = async () => {

        try {

            const response = await axios.get('http://localhost:8000/messages',{
            params: {userId: clickedUserId, correspondingUserId: userId }
            })
            setClickedUsersMessages(response.data)

        } catch (err){
            console.log(err)
        }

    }

    useEffect(() => {

        getUsersMessages()
        getClickedUsersMessages()
        
    }, [])


    const messages = []

    usersMessages?.forEach(message => {
        const formattedMessages = {}
        formattedMessages['name'] = user?.first_name
        formattedMessages['img'] = user?.url
        formattedMessages['message'] =message.message
        formattedMessages['timestamp'] = message.timestamp

        messages.push( formattedMessages )
    })

    clickedUsersMessages?.forEach(message => {
        const formattedMessages = {}
        formattedMessages['name'] = clickedUser?.first_name
        formattedMessages['img'] = clickedUser?.url
        formattedMessages['message'] = message.message
        formattedMessages['timestamp'] = message.timestamp

        messages.push( formattedMessages )
    })

    const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <div>
            <Chat descendingOrderMessages={descendingOrderMessages}/>
            <ChatInput 
                user={user} 
                clickedUser={clickedUser} 
                getUsersMessages={getUsersMessages} 
                getClickedUsersMessages= {getClickedUsersMessages}
            />
        </div>
    )
}

export default ChatDisplay