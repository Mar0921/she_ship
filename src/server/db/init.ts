import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/purplematch.db');

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

async function initDatabase() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  console.log('📦 Inicializando base de datos SQLite...');

  // USUARIOS
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // PERFILES DE USUARIO
  db.run(`CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    display_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    personal_phrase TEXT,
    age INTEGER,
    occupation TEXT,
    location_city TEXT,
    location_region TEXT,
    location_country TEXT,
    is_rural INTEGER DEFAULT 0,
    ethnicity TEXT,
    language_preference TEXT DEFAULT 'español',
    medical_history TEXT,
    is_anonymous_by_default INTEGER DEFAULT 1,
    is_profile_private INTEGER DEFAULT 1,
    member_since DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    notify_email INTEGER DEFAULT 1,
    notify_session_reminder INTEGER DEFAULT 1,
    notify_journal_reminder INTEGER DEFAULT 0,
    onboarding_completed INTEGER DEFAULT 0
  )`);

  // PROFESIONALES
  db.run(`CREATE TABLE professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    professional_card_url TEXT,
    identity_document_url TEXT,
    diplomas_urls TEXT,
    linkedin_url TEXT,
    description TEXT,
    specialties TEXT,
    modality TEXT,
    languages TEXT,
    experience_years INTEGER,
    price_min INTEGER,
    price_max INTEGER,
    is_volunteer INTEGER DEFAULT 0,
    age INTEGER,
    aspirations TEXT,
    previous_clients_info TEXT,
    rating_avg REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    availability_status TEXT DEFAULT 'available',
    is_verified INTEGER DEFAULT 0,
    verification_date DATETIME,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // SESIONES
  db.run(`CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    professional_id INTEGER NOT NULL,
    scheduled_at DATETIME NOT NULL,
    completed_at DATETIME,
    duration_minutes INTEGER,
    modality TEXT,
    status TEXT DEFAULT 'scheduled',
    session_title TEXT,
    session_notes TEXT,
    user_notes TEXT,
    meeting_link TEXT,
    cancellation_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // ENTRADAS DE DIARIO
  db.run(`CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood TEXT,
    content TEXT,
    tags TEXT,
    entry_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
  )`);

  // METAS DE TERAPIA
  db.run(`CREATE TABLE therapy_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    professional_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    progress_percent INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // PUBLICACIONES DE COMUNIDAD
  db.run(`CREATE TABLE community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    is_anonymous INTEGER DEFAULT 0,
    category TEXT,
    content_text TEXT,
    audio_url TEXT,
    audio_is_distorted INTEGER DEFAULT 0,
    image_url TEXT,
    video_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    liked_by TEXT,
    status TEXT DEFAULT 'pending',
    moderated_by INTEGER,
    moderation_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
  )`);

  // COMENTARIOS
  db.run(`CREATE TABLE post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    is_anonymous INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // RECURSOS
  db.run(`CREATE TABLE resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT,
    category TEXT,
    reading_time_minutes INTEGER,
    url TEXT NOT NULL,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // CONTACTOS DE EMERGENCIA
  db.run(`CREATE TABLE emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    description TEXT,
    is_free INTEGER DEFAULT 0,
    is_24h INTEGER DEFAULT 0,
    country TEXT NOT NULL,
    is_active INTEGER DEFAULT 1
  )`);

  // CUESTIONARIO
  db.run(`CREATE TABLE questionnaire_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    support_types TEXT,
    preferred_modality TEXT,
    preferred_language TEXT,
    budget_range TEXT,
    urgency_level TEXT,
    context_urban_rural TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // PROFESIONALES GUARDADOS
  db.run(`CREATE TABLE user_saved_professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    professional_id INTEGER NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, professional_id)
  )`);

  // NOTIFICACIONES
  db.run(`CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT,
    title TEXT NOT NULL,
    body TEXT,
    is_read INTEGER DEFAULT 0,
    related_entity_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // MENSAJES
  db.run(`CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('✅ Tablas creadas exitosamente');

  // USUARIO DE DEMO
  const hashedPassword = await bcrypt.hash('demo123', 10);
  db.run(`INSERT INTO users (email, password, handle, role) VALUES (?, ?, ?, ?)`,
    ['demo@purplematch.es', hashedPassword, 'demo_user', 'user']);
  
  const result = db.exec('SELECT last_insert_rowid() as id');
  const userId = result[0].values[0][0];
  
  db.run(`INSERT INTO user_profiles (user_id, display_name, language_preference, onboarding_completed) VALUES (?, ?, ?, ?)`,
    [userId, 'Usuario Demo', 'español', 1]);

  console.log('✅ Usuario demo creado: demo@purplematch.es / demo123');

  // ADMIN USER
  const adminPassword = await bcrypt.hash('12345678', 10);
  db.run(`INSERT INTO users (email, password, handle, role) VALUES (?, ?, ?, ?)`,
    ['admin@gmail.com', adminPassword, 'admin', 'admin']);
  
  const adminResult = db.exec('SELECT last_insert_rowid() as id');
  const adminId = adminResult[0].values[0][0];
  
  db.run(`INSERT INTO user_profiles (user_id, display_name, language_preference, onboarding_completed) VALUES (?, ?, ?, ?)`,
    [adminId, 'Administrador', 'español', 1]);

  console.log('✅ Admin usuario creado: admin@gmail.com / 12345678');

  // RECURSOS DE EJEMPLO
  const resources = [
    ['Guía para manejar la ansiedad', 'Aprende tecnicas efectivas para controlar la ansiedad', 'article', 'ansiedad', 10, 'https://example.com/ansiedad', 1],
    ['Comunicacion en pareja', 'Consejos para mejorar la comunicacion', 'article', 'relaciones', 15, 'https://example.com/pareja', 1],
    ['Estres laboral', 'Estrategias para el estres en el trabajo', 'article', 'laboral', 8, 'https://example.com/estres', 0],
    ['Autocuidado emocional', 'Practicas para el bienestar emocional', 'guide', 'bienestar', 20, 'https://example.com/autocuidado', 1],
    ['Reconocer acoso', 'Como identificar situaciones de acoso', 'article', 'acoso', 12, 'https://example.com/acoso', 1],
  ];

  for (const r of resources) {
    db.run(`INSERT INTO resources (title, description, content_type, category, reading_time_minutes, url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)`, r);
  }
  console.log('✅ Recursos de ejemplo creados');

  // CONTACTOS DE EMERGENCIA
  const contacts = [
    ['Telefono de la Esperanza', '900 223 232', 'Apoyo emocional 24h', 1, 1, 'España'],
    ['Cruz Roja', '900 221 222', 'Emergencias y apoyo', 1, 1, 'España'],
    ['Telefono contra el Acoso', '900 018 018', 'Linea contra acoso escolar', 1, 1, 'España'],
  ];

  for (const c of contacts) {
    db.run(`INSERT INTO emergency_contacts (name, phone_number, description, is_free, is_24h, country) VALUES (?, ?, ?, ?, ?, ?)`, c);
  }
  console.log('✅ Contactos de emergencia creados');

  // Guardar
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));

  console.log('🎉 Inicializacion completada');
  console.log(`📁 Base de datos: ${dbPath}`);
}

initDatabase().catch(console.error);
