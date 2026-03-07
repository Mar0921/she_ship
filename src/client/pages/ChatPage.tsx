import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
};

type Conversation = {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientRole: 'therapist' | 'patient';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
};

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    recipientId: 'therapist1',
    recipientName: 'Dra. Maria Garcia',
    recipientAvatar: 'MG',
    recipientRole: 'therapist',
    lastMessage: 'Perfecto, nos vemos el jueves a las 14:00',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'conv2',
    recipientId: 'therapist2',
    recipientName: 'Dra. Laura Martinez',
    recipientAvatar: 'LM',
    recipientRole: 'therapist',
    lastMessage: 'Gracias por tu mensaje. Me encantaria ayudarte...',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 'conv3',
    recipientId: 'patient1',
    recipientName: 'Maria L.',
    recipientAvatar: 'ML',
    recipientRole: 'patient',
    lastMessage: 'Gracias por la sesion de hoy',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
    isOnline: true
  }
];

// Mock messages for a conversation
const mockMessages: Record<string, Message[]> = {
  'therapist1': [
    {
      id: 'm1',
      senderId: 'me',
      content: 'Hola Dra. Garcia, me gustaria agendar una sesion con usted.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'therapist1',
      content: 'Hola! Gracias por contactarme. Claro, tengo disponibilidad esta semana. Que dias te vienen mejor?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      status: 'read'
    },
    {
      id: 'm3',
      senderId: 'me',
      content: 'El jueves por la tarde me vendria muy bien, si es posible.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      status: 'read'
    },
    {
      id: 'm4',
      senderId: 'therapist1',
      content: 'El jueves tengo disponible a las 14:00 y a las 17:00. Cual prefieres?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21),
      status: 'read'
    },
    {
      id: 'm5',
      senderId: 'me',
      content: 'Las 14:00 me viene perfecto.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read'
    },
    {
      id: 'm6',
      senderId: 'therapist1',
      content: 'Perfecto, nos vemos el jueves a las 14:00. Te enviare el enlace de la videollamada antes de la sesion.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read'
    }
  ],
  'therapist2': [
    {
      id: 'm1',
      senderId: 'me',
      content: 'Hola, estoy buscando apoyo para manejar mi ansiedad.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'therapist2',
      content: 'Gracias por tu mensaje. Me encantaria ayudarte en tu proceso. Cuanto tiempo llevas experimentando estos sintomas?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'delivered'
    }
  ],
  'patient1': [
    {
      id: 'm1',
      senderId: 'patient1',
      content: 'Hola Dra., queria preguntarle sobre el ejercicio de respiracion que vimos.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'me',
      content: 'Claro! El ejercicio es: inhalar 4 segundos, mantener 7, exhalar 8. Hazlo cuando sientas ansiedad.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
      status: 'read'
    },
    {
      id: 'm3',
      senderId: 'patient1',
      content: 'Gracias por la sesion de hoy, me siento mucho mejor.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'read'
    }
  ]
};

export default function ChatPage() {
  const { recipientId } = useParams<{ recipientId?: string }>();
  const queryClient = useQueryClient();
  
  // Fetch conversations from API
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return [];
      return response.json();
    }
  });
  
  // If there's a recipientId but no existing conversation, fetch the professional data
  const { data: professionalData } = useQuery({
    queryKey: ['professional', recipientId],
    queryFn: async () => {
      if (!recipientId) return null;
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profesionales/${recipientId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) {
        // If API fails, try to get from mock data
        const mockTherapists: Record<string, any> = {
          '1': { fullName: 'Dra. Maria Garcia', avatar: 'MG' },
          '2': { fullName: 'Dra. Laura Martinez', avatar: 'LM' },
          '3': { fullName: 'Dra. Carmen Ruiz', avatar: 'CR' },
          '4': { fullName: 'Dra. Ana Fernandez', avatar: 'AF' },
          '5': { fullName: 'Dra. Sofia Lopez', avatar: 'SL' },
        };
        return mockTherapists[recipientId] || { fullName: 'Profesional', avatar: 'PR' };
      }
      const data = await response.json();
      return {
        fullName: data.fullName,
        avatar: data.avatar || data.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
      };
    },
    enabled: !!recipientId
  });
  
  // Build the list of conversations including the current one if applicable
  const allConversations = React.useMemo(() => {
    const convs = [...conversations];
    
    // If we have a recipientId and it's not in the conversations, add it
    if (recipientId && professionalData && !convs.find((c: Conversation) => c.recipientId === recipientId)) {
      convs.unshift({
        id: recipientId,
        recipientId: recipientId,
        recipientName: professionalData.fullName || 'Profesional',
        recipientAvatar: professionalData.avatar || 'PR',
        recipientRole: 'therapist' as const,
        lastMessage: 'Nueva conversación',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isOnline: false
      });
    }
    return convs;
  }, [conversations, recipientId, professionalData]);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    recipientId ? allConversations.find((c: Conversation) => c.recipientId === recipientId) || null : null
  );
  const [searchQuery, setSearchQuery] = useState('');

  // On mobile, if we have a recipientId, show the chat directly
  const [showChatOnMobile, setShowChatOnMobile] = useState(!!recipientId);

  useEffect(() => {
    if (recipientId) {
      const conv = conversations.find(c => c.recipientId === recipientId);
      if (conv) {
        setSelectedConversation(conv);
        setShowChatOnMobile(true);
      }
    }
  }, [recipientId, conversations]);

  const filteredConversations = allConversations.filter((conv: Conversation) =>
    conv.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
    setSelectedConversation(null);
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-64px)] flex bg-gray-50">
        {/* Conversation List - Hidden on mobile when chat is open */}
        <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
          showChatOnMobile ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    selectedConversation?.id === conv.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      conv.recipientRole === 'therapist' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <span className={`font-semibold ${
                        conv.recipientRole === 'therapist' ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        {conv.recipientAvatar}
                      </span>
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.recipientName}</h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No hay conversaciones</p>
                <Link to="/terapeutas" className="text-purple-600 text-sm hover:underline mt-2 inline-block">
                  Buscar terapeutas
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${
          !showChatOnMobile ? 'hidden md:flex' : 'flex'
        }`}>
          {selectedConversation ? (
            <ChatView
              conversation={selectedConversation}
              onBack={handleBackToList}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tus mensajes</h2>
                <p className="text-gray-500 max-w-sm">
                  Selecciona una conversacion para ver los mensajes o contacta con un terapeuta
                </p>
                <Link to="/terapeutas">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                    Buscar terapeutas
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

interface ChatViewProps {
  conversation: Conversation;
  onBack: () => void;
}

function ChatView({ conversation, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversation.recipientId] || []);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(mockMessages[conversation.recipientId] || []);
  }, [conversation.recipientId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;

    // Send message via API
    const token = localStorage.getItem('token');
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientId: parseInt(conversation.recipientId),
        content: newMessage
      })
    });

    if (response.ok) {
      const sentMessage = await response.json();
      
      const message: Message = {
        id: sentMessage.id,
        senderId: 'me',
        content: newMessage,
        timestamp: new Date(sentMessage.timestamp),
        status: 'sent'
      };

      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              conversation.recipientRole === 'therapist' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <span className={`font-semibold ${
                conversation.recipientRole === 'therapist' ? 'text-purple-600' : 'text-blue-600'
              }`}>
                {conversation.recipientAvatar}
              </span>
            </div>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.recipientName}</h2>
            <p className="text-xs text-gray-500">
              {conversation.isOnline ? 'En linea' : 'Desconectada'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === 'me'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe un mensaje..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white h-12 w-12 p-0 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isOwn ? 'order-2' : ''}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-purple-600 text-white rounded-br-md'
            : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="text-gray-400">
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-purple-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Ayer';
  return dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
