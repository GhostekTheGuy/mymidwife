"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Search, File, Download, Check, CheckCheck, MessageCircle, ArrowLeft } from "lucide-react"
import { dataManager, type Conversation, type Message } from "@/lib/data-manager"
import { useIsMobile } from "@/hooks/use-mobile"

export function MessagesSystem({ preselectedConversationId }: { preselectedConversationId?: string | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const loadedConversations = dataManager.getConversations()
    setConversations(loadedConversations)

    const conversationToSelect =
      preselectedConversationId && loadedConversations.some((c) => c.id === preselectedConversationId)
        ? preselectedConversationId
        : loadedConversations.length > 0
          ? loadedConversations[0].id
          : null

    setSelectedConversationId(conversationToSelect)
  }, [preselectedConversationId])

  useEffect(() => {
    if (selectedConversationId) {
      const loadedMessages = dataManager.getMessages(selectedConversationId)
      setMessages(loadedMessages)
      dataManager.markMessagesAsRead(selectedConversationId)
    } else {
      setMessages([])
    }
    scrollToBottom()
  }, [selectedConversationId])

  useEffect(() => {
    const handleUpdate = () => {
      setConversations(dataManager.getConversations())
      if (selectedConversationId) {
        setMessages(dataManager.getMessages(selectedConversationId))
      }
    }
    window.addEventListener("mymidwife:messagesUpdated", handleUpdate)
    return () => window.removeEventListener("mymidwife:messagesUpdated", handleUpdate)
  }, [selectedConversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Na mobile pokazuj listę konwersacji gdy nie ma wybranej rozmowy
  useEffect(() => {
    if (isMobile) {
      if (preselectedConversationId && selectedConversationId) {
        // Jeśli jest preselected conversation, pokaż od razu konwersację
        setShowConversationList(false)
      } else if (!selectedConversationId) {
        // Jeśli nie ma wybranej rozmowy, pokaż listę
        setShowConversationList(true)
      }
    }
  }, [isMobile, selectedConversationId, preselectedConversationId])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return

    const message: Message = {
      id: dataManager.generateId(),
      conversationId: selectedConversationId,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    }

    dataManager.saveMessage(message)
    setNewMessage("")

    const currentConv = conversations.find((c) => c.id === selectedConversationId)
    if (!currentConv) return

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: dataManager.generateId(),
        conversationId: selectedConversationId,
        senderId: currentConv.midwifeId,
        senderName: currentConv.midwifeName,
        senderAvatar: currentConv.midwifeAvatar,
        content: "Dziękuję za wiadomość! Odpowiem wkrótce.",
        timestamp: new Date().toISOString(),
        type: "text",
        isRead: false,
      }
      dataManager.saveMessage(response)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !selectedConversationId) return

    const file = files[0]
    const attachment = {
      id: dataManager.generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }

    const message: Message = {
      id: dataManager.generateId(),
      conversationId: selectedConversationId,
      senderId: "demo-patient",
      senderName: "Ty",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: `Przesłano plik: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: "file",
      isRead: false,
      attachments: [attachment],
    }

    dataManager.saveMessage(message)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversationId)
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.midwifeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full bg-white rounded-lg border overflow-hidden">
      <div className={`${
        isMobile 
          ? (showConversationList ? 'w-full' : 'hidden') 
          : 'w-1/3'
      } border-r flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Szukaj rozmów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversationId(conversation.id)
                if (isMobile) {
                  setShowConversationList(false)
                }
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversationId === conversation.id ? "bg-pink-50 border-pink-200" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.midwifeAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {conversation.midwifeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-sm truncate">{conversation.midwifeName}</h3>
                      <Badge variant="secondary" className="text-xs w-fit">
                        Położna
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{formatTime(conversation.updatedAt)}</span>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-pink-500 text-white text-xs">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {conversation.lastMessage?.content && conversation.lastMessage.content.length > 60
                      ? `${conversation.lastMessage.content.substring(0, 60)}...`
                      : conversation.lastMessage?.content || "..."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${
        isMobile 
          ? (showConversationList ? 'hidden' : 'w-full') 
          : 'flex-1'
      } flex flex-col transition-all duration-300 ease-in-out`}>
        {selectedConv ? (
          <>
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConversationList(true)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  )}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConv.midwifeAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedConv.midwifeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConv.midwifeName}</h3>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <MessageCircle className="w-16 h-16 mx-auto text-gray-300 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Rozpocznij konwersację</h3>
                    <p className="text-gray-500 mb-4">Napisz wiadomość, aby rozpocząć rozmowę z położną</p>
                    <div className="flex gap-2 justify-center">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isOwn = message.senderId === "demo-patient"
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%]`}>
                          {!isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {message.senderName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">{message.senderName}</span>
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-3 ${isOwn ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-900"}`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    download={attachment.name}
                                    className={`flex items-center gap-2 p-2 rounded ${
                                      isOwn ? "bg-pink-600" : "bg-gray-200"
                                    } hover:bg-pink-700/50`}
                                  >
                                    <File className="w-4 h-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                                      <p className="text-xs opacity-75">{(attachment.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <Download className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                              isOwn ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwn && (
                              <div className="flex">
                                {message.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={selectedConv.midwifeAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {selectedConv.midwifeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Napisz wiadomość..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="shrink-0 bg-pink-500 hover:bg-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Wybierz rozmowę, aby rozpocząć czat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
