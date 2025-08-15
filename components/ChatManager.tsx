import { useState } from 'react'
import ChatButton from './ChatButton'
import ChatGPT from './ChatGPT'

export default function ChatManager() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)

  return (
    <>
      <ChatButton onClick={openChat} />
      <ChatGPT isOpen={isChatOpen} onClose={closeChat} />
    </>
  )
}
