import { useState } from 'react';
import {
  Heart,
  Shield,
  Briefcase,
  Brain,
  MessageCircle,
  Users,
  Plus,
  ThumbsUp,
  MessageSquare,
  Clock,
  X,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  Video,
  Calendar,
  ExternalLink,
  CalendarPlus
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';
import { toast } from 'react-hot-toast';

type Category = 'todos' | 'acoso' | 'relaciones' | 'laboral' | 'ansiedad' | 'apoyo';

type Comment = {
  id: string;
  author: string;
  isAnonymous: boolean;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked: boolean;
};

type Post = {
  id: string;
  author: string;
  isAnonymous: boolean;
  category: Category;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
};

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: 'Rosa',
    isAnonymous: false,
    content: 'Que valiente! Dar ese primer paso es lo mas dificil. Te deseo mucho exito en tu proceso.',
    timestamp: 'Hace 1 hora',
    likes: 8,
    hasLiked: false
  },
  {
    id: 'c2',
    author: 'Anonima',
    isAnonymous: true,
    content: 'Me identifico mucho con lo que dices. Yo tambien estuve meses pensandolo antes de decidirme. Ahora llevo 6 meses en terapia y ha cambiado mi vida.',
    timestamp: 'Hace 30 min',
    likes: 12,
    hasLiked: true
  },
  {
    id: 'c3',
    author: 'Marina',
    isAnonymous: false,
    content: 'Gracias por compartir! Estoy en ese momento de duda que mencionas. Tu experiencia me da esperanza.',
    timestamp: 'Hace 15 min',
    likes: 5,
    hasLiked: false
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Luna',
    isAnonymous: false,
    category: 'ansiedad',
    content: 'Hoy tuve mi primera sesion de terapia despues de mucho tiempo pensandolo. Estaba muy nerviosa pero mi terapeuta me hizo sentir muy comoda. Queria compartirlo porque se que muchas estan en ese momento de duda. Vale la pena dar el paso.',
    timestamp: 'Hace 2 horas',
    likes: 24,
    comments: mockComments,
    hasLiked: false
  },
  {
    id: '2',
    author: 'Anonima',
    isAnonymous: true,
    category: 'relaciones',
    content: 'Me cuesta mucho reconocer cuando una relacion es toxica. Mi terapeuta me esta ayudando a identificar patrones que antes no veia. Alguien mas ha pasado por esto?',
    timestamp: 'Hace 5 horas',
    likes: 31,
    comments: [
      {
        id: 'c4',
        author: 'Anonima',
        isAnonymous: true,
        content: 'Si, yo pase por lo mismo. Es un proceso largo pero vale la pena. Animo!',
        timestamp: 'Hace 4 horas',
        likes: 6,
        hasLiked: false
      }
    ],
    hasLiked: true
  },
  {
    id: '3',
    author: 'Estrella',
    isAnonymous: false,
    category: 'apoyo',
    content: 'Solo queria decir que esta comunidad me ha ayudado mucho. Leer sus historias me hace sentir menos sola. Gracias por existir y por crear este espacio seguro.',
    timestamp: 'Hace 8 horas',
    likes: 45,
    comments: [
      {
        id: 'c5',
        author: 'Sofia',
        isAnonymous: false,
        content: 'Gracias a ti por ser parte de esto! Juntas somos mas fuertes.',
        timestamp: 'Hace 7 horas',
        likes: 15,
        hasLiked: true
      },
      {
        id: 'c6',
        author: 'Anonima',
        isAnonymous: true,
        content: 'Totalmente de acuerdo. Este espacio es un refugio.',
        timestamp: 'Hace 6 horas',
        likes: 9,
        hasLiked: false
      }
    ],
    hasLiked: false
  },
  {
    id: '4',
    author: 'Anonima',
    isAnonymous: true,
    category: 'laboral',
    content: 'Sufro acoso en mi trabajo y no sabia como manejarlo. Encontre recursos aqui que me ayudaron a entender mis derechos. Estoy documentando todo y considerando mis opciones.',
    timestamp: 'Ayer',
    likes: 38,
    comments: [],
    hasLiked: false
  }
];

const categories = [
  { id: 'todos', label: 'Todos', icon: Users, color: 'text-gray-600 bg-gray-100' },
  { id: 'acoso', label: 'Acoso', icon: Shield, color: 'text-red-600 bg-red-100' },
  { id: 'relaciones', label: 'Relaciones', icon: Heart, color: 'text-pink-600 bg-pink-100' },
  { id: 'laboral', label: 'Laboral', icon: Briefcase, color: 'text-blue-600 bg-blue-100' },
  { id: 'ansiedad', label: 'Ansiedad', icon: Brain, color: 'text-whatsapp-600 bg-whatsapp-100' },
  { id: 'apoyo', label: 'Apoyo General', icon: MessageCircle, color: 'text-green-600 bg-green-100' }
] as const;

const communityRules = [
  { icon: Heart, text: 'Respeto mutuo en todo momento' },
  { icon: Lock, text: 'Confidencialidad absoluta' },
  { icon: Shield, text: 'No compartir datos personales' },
  { icon: MessageCircle, text: 'Empatia y apoyo' },
  { icon: AlertTriangle, text: 'Reportar contenido inapropiado' }
];

type GroupSession = {
  id: string;
  title: string;
  description: string;
  host: string;
  date: Date;
  duration: string;
  meetLink: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  isRecurring: boolean;
};

const mockGroupSessions: GroupSession[] = [
  {
    id: 'gs1',
    title: 'Circulo de apoyo: Manejo de ansiedad',
    description: 'Espacio seguro para compartir tecnicas y experiencias sobre el manejo de la ansiedad en el dia a dia.',
    host: 'Dra. Maria Garcia',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // In 2 days
    duration: '90 min',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    maxParticipants: 12,
    currentParticipants: 8,
    category: 'ansiedad',
    isRecurring: true
  },
  {
    id: 'gs2',
    title: 'Taller: Estableciendo limites saludables',
    description: 'Aprende herramientas practicas para establecer limites en tus relaciones personales y laborales.',
    host: 'Dra. Carmen Ruiz',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // In 5 days
    duration: '60 min',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    maxParticipants: 15,
    currentParticipants: 12,
    category: 'relaciones',
    isRecurring: false
  },
  {
    id: 'gs3',
    title: 'Grupo de sanacion: Superando el trauma',
    description: 'Sesion guiada para mujeres en proceso de sanacion de experiencias traumaticas. Ambiente de confidencialidad total.',
    host: 'Dra. Laura Martinez',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // In 7 days
    duration: '120 min',
    meetLink: 'https://meet.google.com/uvw-xyz-123',
    maxParticipants: 8,
    currentParticipants: 5,
    category: 'apoyo',
    isRecurring: true
  },
  {
    id: 'gs4',
    title: 'Meditacion guiada semanal',
    description: 'Sesion de meditacion y mindfulness para reducir el estres y conectar con tu bienestar interior.',
    host: 'Dra. Sofia Lopez',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // In 3 days
    duration: '45 min',
    meetLink: 'https://meet.google.com/456-789-abc',
    maxParticipants: 20,
    currentParticipants: 14,
    category: 'ansiedad',
    isRecurring: true
  }
];

export default function ComunidadPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeView, setActiveView] = useState<'posts' | 'sessions'>('posts');
  const [selectedSession, setSelectedSession] = useState<GroupSession | null>(null);

  const filteredPosts = selectedCategory === 'todos'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const filteredSessions = selectedCategory === 'todos'
    ? mockGroupSessions
    : mockGroupSessions.filter(session => session.category === selectedCategory);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'hasLiked'>) => {
    const post: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
      timestamp: 'Ahora',
      likes: 0,
      comments: [],
      hasLiked: false
    };
    setPosts([post, ...posts]);
  };

  if (selectedPost) {
    return (
      <Layout>
        <PostDetailView
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onLike={() => handleLike(selectedPost.id)}
          onAddComment={(comment) => handleAddComment(selectedPost.id, comment)}
        />
      </Layout>
    );
  }

  if (selectedSession) {
    return (
      <Layout>
        <SessionDetailView
          session={selectedSession}
          onBack={() => setSelectedSession(null)}
        />
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* View Toggle */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('posts')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      activeView === 'posts'
                        ? 'bg-whatsapp-100 text-whatsapp-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveView('sessions')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      activeView === 'sessions'
                        ? 'bg-whatsapp-100 text-whatsapp-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Sesiones
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <nav className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as Category)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-whatsapp-100 text-whatsapp-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-whatsapp-200' : category.color
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Community Rules */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Normas de convivencia</h3>
                <ul className="space-y-3">
                  {communityRules.map((rule, index) => {
                    const Icon = rule.icon;
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Icon className="w-4 h-4 text-whatsapp-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{rule.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Comunidad de Apoyo</h1>
                <p className="text-gray-500">Un espacio seguro para compartir y crecer juntas</p>
              </div>
              {activeView === 'posts' && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Publicacion
                </Button>
              )}
            </div>

            {/* Mobile view toggle */}
            <div className="lg:hidden mb-4">
              <div className="bg-white rounded-xl p-2 flex gap-2">
                <button
                  onClick={() => setActiveView('posts')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === 'posts'
                      ? 'bg-whatsapp-100 text-whatsapp-700'
                      : 'text-gray-600'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Posts
                </button>
                <button
                  onClick={() => setActiveView('sessions')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === 'sessions'
                      ? 'bg-whatsapp-100 text-whatsapp-700'
                      : 'text-gray-600'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Sesiones grupales
                </button>
              </div>
            </div>

            {/* Mobile category selector */}
            <div className="lg:hidden mb-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id as Category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-whatsapp-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content based on active view */}
            {activeView === 'posts' ? (
              <>
                {/* Posts */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={() => handleLike(post.id)}
                      onViewComments={() => setSelectedPost(post)}
                    />
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay publicaciones en esta categoria
                    </h3>
                    <p className="text-gray-500">
                      Se la primera en compartir tu experiencia
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Group Sessions */}
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <GroupSessionCard
                      key={session.id}
                      session={session}
                      onViewDetails={() => setSelectedSession(session)}
                    />
                  ))}
                </div>

                {filteredSessions.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay sesiones grupales programadas
                    </h3>
                    <p className="text-gray-500">
                      Vuelve pronto para ver nuevas sesiones
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal 
          onClose={() => setShowCreatePost(false)} 
          onSubmit={handleCreatePost}
        />
      )}
    </Layout>
  );
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onViewComments: () => void;
}

function PostCard({ post, onLike, onViewComments }: PostCardProps) {
  const category = categories.find(c => c.id === post.category);
  const CategoryIcon = category?.icon || MessageCircle;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            post.isAnonymous ? 'bg-gray-200' : 'bg-whatsapp-100'
          }`}>
            {post.isAnonymous ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <span className="text-whatsapp-600 font-semibold">{post.author[0]}</span>
            )}
          </div>
          <div>
            <span className={`font-medium ${post.isAnonymous ? 'text-gray-500' : 'text-gray-900'}`}>
              {post.author}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              {post.timestamp}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${category?.color || 'bg-gray-100 text-gray-600'}`}>
          <CategoryIcon className="w-3 h-3" />
          {category?.label}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            post.hasLiked
              ? 'bg-whatsapp-100 text-whatsapp-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">{post.likes}</span>
        </button>
        <button
          onClick={onViewComments}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-medium">{post.comments.length}</span>
          <span className="text-sm">Ver comentarios</span>
        </button>
      </div>
    </div>
  );
}

interface PostDetailViewProps {
  post: Post;
  onBack: () => void;
  onLike: () => void;
  onAddComment: (comment: Comment) => void;
}

function PostDetailView({ post, onBack, onLike, onAddComment }: PostDetailViewProps) {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [postLikes, setPostLikes] = useState(post.likes);
  const [postHasLiked, setPostHasLiked] = useState(post.hasLiked);

  const category = categories.find(c => c.id === post.category);
  const CategoryIcon = category?.icon || MessageCircle;

  const handleLikePost = () => {
    setPostLikes(postHasLiked ? postLikes - 1 : postLikes + 1);
    setPostHasLiked(!postHasLiked);
    onLike();
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
          hasLiked: !c.hasLiked
        };
      }
      return c;
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error('Escribe un comentario');
      return;
    }

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: isAnonymous ? 'Anonima' : 'Usuario',
      isAnonymous,
      content: newComment,
      timestamp: 'Ahora',
      likes: 0,
      hasLiked: false
    };

    setComments([...comments, comment]);
    onAddComment(comment);
    setNewComment('');
    toast.success('Comentario publicado');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-whatsapp-600 hover:text-whatsapp-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la comunidad
      </button>

      {/* Post */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              post.isAnonymous ? 'bg-gray-200' : 'bg-whatsapp-100'
            }`}>
              {post.isAnonymous ? (
                <EyeOff className="w-6 h-6 text-gray-500" />
              ) : (
                <span className="text-whatsapp-600 font-bold text-lg">{post.author[0]}</span>
              )}
            </div>
            <div>
              <span className={`font-semibold ${post.isAnonymous ? 'text-gray-500' : 'text-gray-900'}`}>
                {post.author}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {post.timestamp}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${category?.color || 'bg-gray-100 text-gray-600'}`}>
            <CategoryIcon className="w-3 h-3" />
            {category?.label}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          {post.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLikePost}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              postHasLiked
                ? 'bg-whatsapp-100 text-whatsapp-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${postHasLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{postLikes}</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{comments.length} comentarios</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6">Comentarios ({comments.length})</h3>

        {/* Comment Input */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario de apoyo..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent resize-none mb-3"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isAnonymous
                  ? 'bg-whatsapp-100 text-whatsapp-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isAnonymous ? 'Anonima' : 'Con mi nombre'}
            </button>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Comentar
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    comment.isAnonymous ? 'bg-gray-200' : 'bg-whatsapp-100'
                  }`}>
                    {comment.isAnonymous ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <span className="text-whatsapp-600 font-semibold text-sm">{comment.author[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm ${comment.isAnonymous ? 'text-gray-500' : 'text-gray-900'}`}>
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        comment.hasLiked
                          ? 'text-whatsapp-600'
                          : 'text-gray-400 hover:text-whatsapp-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${comment.hasLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay comentarios aun. Se la primera en comentar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'hasLiked'>) => void;
}

function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('apoyo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({
      author: isAnonymous ? 'Anonima' : 'Usuario',
      isAnonymous,
      category: selectedCategory,
      content: content.trim()
    });
    
    toast.success('Publicacion creada');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Nueva publicacion</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.id !== 'todos').map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id as Category)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-whatsapp-100 text-whatsapp-700 ring-2 ring-whatsapp-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu mensaje
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte tu experiencia, pregunta o reflexion..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Anonymous toggle */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-colors ${
                isAnonymous
                  ? 'border-whatsapp-600 bg-whatsapp-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isAnonymous ? 'bg-whatsapp-200' : 'bg-gray-100'
              }`}>
                {isAnonymous ? (
                  <EyeOff className="w-5 h-5 text-whatsapp-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="text-left">
                <span className={`font-medium ${isAnonymous ? 'text-whatsapp-700' : 'text-gray-900'}`}>
                  Participar de forma anonima
                </span>
                <p className="text-sm text-gray-500">
                  Tu nombre no sera visible para otras usuarias
                </p>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!content.trim()}
              className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
            >
              Publicar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface GroupSessionCardProps {
  session: GroupSession;
  onViewDetails: () => void;
}

function GroupSessionCard({ session, onViewDetails }: GroupSessionCardProps) {
  const spotsLeft = session.maxParticipants - session.currentParticipants;
  const isFull = spotsLeft === 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleJoin = () => {
    if (!isFull) {
      toast.success('Te has inscrito a la sesion');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-whatsapp-100 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-whatsapp-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{session.title}</h3>
            <p className="text-sm text-gray-500">Facilita: {session.host}</p>
          </div>
        </div>
        {session.isRecurring && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Semanal
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">{session.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(session.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {session.duration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {session.currentParticipants}/{session.maxParticipants} participantes
        </span>
      </div>

      {/* Progress bar for spots */}
      <div className="mb-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isFull ? 'bg-red-500' : 'bg-whatsapp-500'}`}
            style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${isFull ? 'text-red-600' : 'text-green-600'}`}>
          {isFull ? 'Sesion completa' : `${spotsLeft} plazas disponibles`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1"
        >
          Ver detalles
        </Button>
        <Button
          onClick={handleJoin}
          disabled={isFull}
          className={`flex-1 ${isFull ? 'bg-gray-300' : 'bg-whatsapp-500 hover:bg-whatsapp-600'} text-white`}
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          {isFull ? 'Completa' : 'Inscribirme'}
        </Button>
      </div>
    </div>
  );
}

interface SessionDetailViewProps {
  session: GroupSession;
  onBack: () => void;
}

function SessionDetailView({ session, onBack }: SessionDetailViewProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showVoiceModModal, setShowVoiceModModal] = useState(false);
  const [pendingMeetLink, setPendingMeetLink] = useState<string | null>(null);
  const spotsLeft = session.maxParticipants - session.currentParticipants;
  const isFull = spotsLeft === 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegister = () => {
    setIsRegistered(true);
    toast.success('Te has inscrito a la sesion');
  };

  const handleJoinSession = () => {
    setPendingMeetLink(session.meetLink);
    setShowVoiceModModal(true);
  };

  const handleConfirmJoin = () => {
    setShowVoiceModModal(false);
    if (pendingMeetLink) {
      window.open(pendingMeetLink, '_blank');
    }
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(session.title);
    const details = encodeURIComponent(session.description + '\n\nEnlace: ' + session.meetLink);
    const startDate = session.date.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(session.date.getTime() + parseInt(session.duration) * 60000).toISOString().replace(/-|:|\.\d+/g, '');

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDate}/${endDate}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-whatsapp-600 hover:text-whatsapp-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a sesiones grupales
      </button>

      {/* Session Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-whatsapp-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Video className="w-8 h-8 text-whatsapp-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
              {session.isRecurring && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Semanal
                </span>
              )}
            </div>
            <p className="text-gray-600">Facilitada por <span className="font-semibold">{session.host}</span></p>
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{session.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Fecha</span>
            </div>
            <p className="text-gray-900 font-semibold">{formatDate(session.date)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Hora y duracion</span>
            </div>
            <p className="text-gray-900 font-semibold">{formatTime(session.date)} ({session.duration})</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Participantes</span>
            </div>
            <p className="text-gray-900 font-semibold">
              {session.currentParticipants}/{session.maxParticipants}
              <span className={`ml-2 text-sm ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                ({isFull ? 'Completa' : `${spotsLeft} plazas`})
              </span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Plataforma</span>
            </div>
            <p className="text-gray-900 font-semibold">Google Meet</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isRegistered ? (
            <>
              <button
                onClick={handleJoinSession}
                className="flex-1"
              >
                <Button className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Unirse a la reunion
                </Button>
              </button>
              <Button
                variant="outline"
                onClick={addToCalendar}
                className="flex-1"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Agregar a Google Calendar
              </Button>
            </>
          ) : (
            <Button
              onClick={handleRegister}
              disabled={isFull}
              className={`flex-1 ${isFull ? 'bg-gray-300' : 'bg-whatsapp-500 hover:bg-whatsapp-600'} text-white`}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              {isFull ? 'Sesion completa' : 'Inscribirme a esta sesion'}
            </Button>
          )}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-whatsapp-50 rounded-2xl p-6 border border-whatsapp-100">
        <h3 className="font-semibold text-whatsapp-900 mb-4">Antes de unirte</h3>
        <ul className="space-y-3 text-whatsapp-800 text-sm">
          <li className="flex items-start gap-2">
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Todo lo compartido en la sesion es estrictamente confidencial</span>
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Trata a todas las participantes con respeto y empatia</span>
          </li>
          <li className="flex items-start gap-2">
            <Video className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Puedes participar con camara apagada si lo prefieres</span>
          </li>
          <li className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>La facilitadora guiara la sesion y moderara las intervenciones</span>
          </li>
        </ul>
      </div>

      {/* VoiceMod Warning Modal */}
      {showVoiceModModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowVoiceModModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Participacion anonima
              </h3>
              
              <p className="text-gray-600 mb-6">
                Si quieres participar de forma anonima a la reunion, descarga:{' '}
                <a 
                  href="https://www.voicemod.net/es/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-whatsapp-600 hover:text-whatsapp-700 underline font-medium"
                >
                  https://www.voicemod.net/es/
                </a>
              </p>
              
              <button
                onClick={handleConfirmJoin}
                className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
