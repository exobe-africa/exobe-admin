"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { MessagesSquare, Search, Send } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    { id: 1, name: 'John Doe', lastMessage: 'Thanks for your help!', time: '2 min ago', unread: 0, avatar: 'J' },
    { id: 2, name: 'Jane Smith', lastMessage: 'When will my order arrive?', time: '15 min ago', unread: 2, avatar: 'J' },
    { id: 3, name: 'Tech Solutions SA', lastMessage: 'Updated product catalog', time: '1 hour ago', unread: 0, avatar: 'T' },
    { id: 4, name: 'Mike Johnson', lastMessage: 'Need assistance with payment', time: '2 hours ago', unread: 1, avatar: 'M' },
  ];

  const messages = [
    { id: 1, sender: 'John Doe', text: 'Hi, I need help with my recent order', time: '10:30 AM', isAdmin: false },
    { id: 2, sender: 'Admin', text: 'Hello! I\'d be happy to help. What\'s your order number?', time: '10:32 AM', isAdmin: true },
    { id: 3, sender: 'John Doe', text: 'It\'s ORD-2025-001', time: '10:33 AM', isAdmin: false },
    { id: 4, sender: 'Admin', text: 'Let me check that for you right away.', time: '10:34 AM', isAdmin: true },
    { id: 5, sender: 'John Doe', text: 'Thanks for your help!', time: '10:45 AM', isAdmin: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with users and vendors</p>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-280px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Input
                placeholder="Search conversations..."
                value=""
                onChange={() => {}}
                icon={Search}
                fullWidth
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{conv.name}</h3>
                        {conv.unread > 0 && (
                          <Badge variant="danger" size="sm">{conv.unread}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold">
                      J
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-500">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${message.isAdmin ? 'bg-[#C8102E] text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                        <p className="text-sm font-medium mb-1">{message.sender}</p>
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.isAdmin ? 'text-white/70' : 'text-gray-500'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={setMessageText}
                        fullWidth
                      />
                    </div>
                    <Button icon={Send}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessagesSquare className="mx-auto mb-3 text-gray-400" size={48} />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

