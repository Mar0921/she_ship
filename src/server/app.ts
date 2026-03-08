/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authenticateToken, optionalAuth, generateToken } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database path - try multiple locations for production compatibility
let dbPath: string;

// Check if we're in a dist folder (production)
if (__dirname.includes('/dist/') || __dirname.includes('\\dist\\')) {
  // In production: check multiple possible locations
  const possiblePaths = [
    path.join(__dirname, '../../data/purplematch.db'),  // from dist/server to data/
    path.join(__dirname, '../../../data/purplematch.db'), // alternative
    path.join(process.cwd(), 'src/data/purplematch.db'), // from project root
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(path.dirname(p))) {
      dbPath = p;
      break;
    }
  }
  
  if (!dbPath) {
    // Use the first option as default
    dbPath = possiblePaths[0];
  }
} else {
  // Development: use relative path from src/server/
  dbPath = path.join(__dirname, '../data/purplematch.db');
}

console.log('🗄️  __dirname:', __dirname);
console.log('🗄️  dbPath:', dbPath);

// Create data directory if it doesn't exist
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Directorio de datos creado en:', dataDir);
}

const app: any = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let db: SqlJsDatabase;

async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log('📦 Base de datos existente cargada');
  } else {
    db = new SQL.Database();
    console.log('📦 Creando nueva base de datos...');
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      handle TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
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

    db.run(`CREATE TABLE IF NOT EXISTS professionals (
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

    db.run(`CREATE TABLE IF NOT EXISTS sessions (
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

    db.run(`CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mood TEXT,
      content TEXT,
      tags TEXT,
      entry_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS therapy_goals (
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

    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      is_anonymous INTEGER DEFAULT 0,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      content_type TEXT,
      category TEXT,
      reading_time_minutes INTEGER,
      url TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      description TEXT,
      is_free INTEGER DEFAULT 0,
      is_24h INTEGER DEFAULT 0,
      country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS matching_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      preferred_modality TEXT,
      preferred_language TEXT,
      budget_range TEXT,
      urgency_level TEXT,
      context_urban_rural TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_saved_professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, professional_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT,
      title TEXT NOT NULL,
      body TEXT,
      is_read INTEGER DEFAULT 0,
      related_entity_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ Tablas creadas');

    // Create seed data - Admin user
    const adminPassword = await bcrypt.hash('12345678', 10);
    db.run(`INSERT INTO users (email, password, handle, role) VALUES (?, ?, ?, ?)`,
      ['admin@gmail.com', adminPassword, 'admin', 'admin']);
    
    const adminResult = db.exec('SELECT last_insert_rowid() as id');
    const adminId = adminResult[0].values[0][0];
    
    db.run(`INSERT INTO user_profiles (user_id, display_name, language_preference, onboarding_completed) VALUES (?, ?, ?, ?)`,
      [adminId, 'Administrador', 'español', 1]);

    console.log('✅ Admin usuario creado: admin@gmail.com / 12345678');

    // Demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    db.run(`INSERT INTO users (email, password, handle, role) VALUES (?, ?, ?, ?)`,
      ['demo@purplematch.es', hashedPassword, 'demo_user', 'user']);
    
    const result = db.exec('SELECT last_insert_rowid() as id');
    const userId = result[0].values[0][0];
    
    db.run(`INSERT INTO user_profiles (user_id, display_name, language_preference, onboarding_completed) VALUES (?, ?, ?, ?)`,
      [userId, 'Usuario Demo', 'español', 1]);

    console.log('✅ Usuario demo creado: demo@purplematch.es / demo123');

    // Save the database
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    console.log('💾 Base de datos guardada');
  }
}

function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function parseJSON<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

// Helper for sql.js query results
function queryAll(sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  // Filter out undefined/null values and convert to strings
  const validParams = params.map(p => p === undefined || p === null ? null : p);
  if (validParams.length > 0) {
    stmt.bind(validParams);
  }
  const results: any[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();
  return results;
}

function queryOne(sql: string, params: any[] = []): any {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function runSql(sql: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
  // Filter out undefined values
  const validParams = params.map(p => p === undefined || p === null ? null : p);
  db.run(sql, validParams);
  const lastId = db.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0] || 0;
  const changes = db.getRowsModified();
  return { lastInsertRowid: lastId, changes };
}

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================

app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, password, handle, role = 'user' } = req.body;

    console.log('📝 Intento de registro:', { email, handle, role });

    if (!email || !password || !handle) {
      return res.status(400).json({ error: 'Email, contraseña y nombre de usuario requeridos' });
    }

    const existingUser = queryOne('SELECT id FROM users WHERE email = ? OR handle = ?', [email, handle]);
    if (existingUser) {
      return res.status(400).json({ error: 'El email o nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = runSql('INSERT INTO users (email, password, handle, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, handle, role]);

    const userId = result.lastInsertRowid;
    runSql('INSERT INTO user_profiles (user_id, display_name, language_preference, onboarding_completed) VALUES (?, ?, ?, ?)',
      [userId, handle, 'español', 0]);

    const token = generateToken({ id: userId, email, handle, role });
    saveDatabase();

    console.log(`✅ Usuario registrado en la base de datos: ${email} (ID: ${userId}, Rol: ${role})`);

    res.status(201).json({ token, user: { id: userId, email, handle, role } });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    console.log('📝 Intento de login:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('👤 Usuario encontrado:', { id: user.id, email: user.email, role: user.role });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('❌ Contraseña inválida para:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso:', email);

    runSql('UPDATE user_profiles SET last_login = ? WHERE user_id = ?', [new Date().toISOString(), user.id]);
    saveDatabase();

    const token = generateToken({ id: user.id, email: user.email, handle: user.handle, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, handle: user.handle, role: user.role } });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res: any) => {
  const user = queryOne('SELECT id, email, handle, role, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(user);
});

// ============================================================================
// PERFIL DE USUARIO
// ============================================================================

app.get('/api/user/profile', authenticateToken, (req: any, res: any) => {
  const profile = queryOne(`
    SELECT up.*, u.email, u.handle, u.role
    FROM user_profiles up
    JOIN users u ON u.id = up.user_id
    WHERE up.user_id = ?
  `, [req.user.id]);

  if (!profile) {
    return res.json({
      display_name: req.user.handle,
      language_preference: 'español',
      onboarding_completed: false,
    });
  }
  res.json(profile);
});

app.put('/api/user/profile', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { display_name, full_name, personal_phrase, age, occupation, location_city, location_region,
    location_country, is_rural, ethnicity, language_preference, medical_history, is_anonymous_by_default,
    is_profile_private, notify_email, notify_session_reminder, notify_journal_reminder } = req.body;

  const existing = queryOne('SELECT id FROM user_profiles WHERE user_id = ?', [userId]);

  if (existing) {
    runSql(`UPDATE user_profiles SET
      display_name = COALESCE(?, display_name), full_name = COALESCE(?, full_name),
      personal_phrase = COALESCE(?, personal_phrase), age = COALESCE(?, age),
      occupation = COALESCE(?, occupation), location_city = COALESCE(?, location_city),
      location_region = COALESCE(?, location_region), location_country = COALESCE(?, location_country),
      is_rural = COALESCE(?, is_rural), ethnicity = COALESCE(?, ethnicity),
      language_preference = COALESCE(?, language_preference), medical_history = COALESCE(?, medical_history),
      is_anonymous_by_default = COALESCE(?, is_anonymous_by_default), is_profile_private = COALESCE(?, is_profile_private),
      notify_email = COALESCE(?, notify_email), notify_session_reminder = COALESCE(?, notify_session_reminder),
      notify_journal_reminder = COALESCE(?, notify_journal_reminder)
    WHERE user_id = ?`,
      [display_name, full_name, personal_phrase, age, occupation, location_city, location_region,
        location_country, is_rural ? 1 : 0, ethnicity, language_preference, medical_history,
        is_anonymous_by_default ? 1 : 0, is_profile_private ? 1 : 0, notify_email ? 1 : 0,
        notify_session_reminder ? 1 : 0, notify_journal_reminder ? 1 : 0, userId]);
  } else {
    runSql('INSERT INTO user_profiles (user_id, display_name, language_preference) VALUES (?, ?, ?)',
      [userId, display_name || req.user.handle, 'español']);
  }

  saveDatabase();
  res.json({ success: true });
});

// ============================================================================
// PERFIL PROFESIONAL
// ============================================================================

app.get('/api/profesional/profile', authenticateToken, (req: any, res: any) => {
  const profile = queryOne('SELECT * FROM professionals WHERE user_id = ?', [req.user.id]);
  if (!profile) {
    return res.json(null);
  }
  res.json({
    _id: profile.id.toString(),
    fullName: profile.full_name,
    description: profile.description,
    specialties: parseJSON(profile.specialties, []),
    modality: profile.modality,
    languages: parseJSON(profile.languages, []),
    experienceYears: profile.experience_years,
    priceMin: profile.price_min,
    priceMax: profile.price_max,
    isVerified: profile.is_verified === 1,
    availabilityStatus: profile.availability_status,
  });
});

// Get professional by ID (public endpoint for starting chats)
app.get('/api/profesionales/:id', (req: any, res: any) => {
  const { id } = req.params;
  const profile = queryOne('SELECT * FROM professionals WHERE id = ?', [id]);
  if (!profile) {
    // If not found in database, return mock data for demo
    const mockTherapists: Record<string, any> = {
      '1': { fullName: 'Dra. Maria Garcia', avatar: 'MG' },
      '2': { fullName: 'Dra. Laura Martinez', avatar: 'LM' },
      '3': { fullName: 'Dra. Carmen Ruiz', avatar: 'CR' },
      '4': { fullName: 'Dra. Ana Fernandez', avatar: 'AF' },
      '5': { fullName: 'Dra. Sofia Lopez', avatar: 'SL' },
    };
    const mockData = mockTherapists[id];
    if (mockData) {
      return res.json({
        _id: id,
        ...mockData,
        description: 'Profesional verificado',
        specialties: ['Terapia'],
        languages: ['Español'],
      });
    }
    return res.status(404).json({ error: 'Profesional no encontrado' });
  }
  res.json({
    _id: profile.id.toString(),
    fullName: profile.full_name,
    description: profile.description,
    specialties: parseJSON(profile.specialties, []),
    modality: profile.modality,
    languages: parseJSON(profile.languages, []),
    experienceYears: profile.experience_years,
    priceMin: profile.price_min,
    priceMax: profile.price_max,
    isVerified: profile.is_verified === 1,
    availabilityStatus: profile.availability_status,
  });
});

app.post('/api/profesional/register', authenticateToken, (req: any, res: any) => {
  const { full_name, description, specialties, modality, languages, experience_years, price_min, price_max, is_volunteer, location, linkedin_url } = req.body;
  const userId = req.user.id;

  const existing = queryOne('SELECT id FROM professionals WHERE user_id = ?', [userId]);
  if (existing) {
    return res.status(400).json({ error: 'Ya estás registrado como profesional' });
  }

  runSql(`INSERT INTO professionals (
    user_id, full_name, description, specialties, modality, languages,
    experience_years, price_min, price_max, is_volunteer, location, linkedin_url,
    is_verified, availability_status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'available')`,
    [userId, full_name, description, JSON.stringify(specialties), modality, JSON.stringify(languages),
      experience_years, price_min, price_max, is_volunteer ? 1 : 0, location, linkedin_url]);

  // Update user role to professional
  runSql('UPDATE users SET role = ? WHERE id = ?', ['professional', userId]);

  saveDatabase();
  res.json({ success: true });
});

app.put('/api/profesional/profile', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { full_name, description, specialties, modality, languages, experience_years, price_min, price_max, is_volunteer, location, linkedin_url, availability_status } = req.body;

  const existing = queryOne('SELECT id FROM professionals WHERE user_id = ?', [userId]);

  if (existing) {
    runSql(`UPDATE professionals SET
      full_name = COALESCE(?, full_name),
      description = COALESCE(?, description),
      specialties = COALESCE(?, specialties),
      modality = COALESCE(?, modality),
      languages = COALESCE(?, languages),
      experience_years = COALESCE(?, experience_years),
      price_min = COALESCE(?, price_min),
      price_max = COALESCE(?, price_max),
      is_volunteer = COALESCE(?, is_volunteer),
      location = COALESCE(?, location),
      linkedin_url = COALESCE(?, linkedin_url),
      availability_status = COALESCE(?, availability_status)
    WHERE user_id = ?`,
      [full_name, description, specialties ? JSON.stringify(specialties) : null, modality, languages ? JSON.stringify(languages) : null,
        experience_years, price_min, price_max, is_volunteer ? 1 : 0, location, linkedin_url, availability_status, userId]);
  } else {
    runSql(`INSERT INTO professionals (
      user_id, full_name, description, specialties, modality, languages,
      experience_years, price_min, price_max, is_volunteer, location, linkedin_url,
      availability_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [userId, full_name, description, JSON.stringify(specialties || []), modality, JSON.stringify(languages || []),
        experience_years, price_min, price_max, is_volunteer ? 1 : 0, location, linkedin_url]);
  }

  saveDatabase();
  res.json({ success: true });
});

// ============================================================================
// PROFESIONALES
// ============================================================================

app.get('/api/professionals', optionalAuth, (req: any, res: any) => {
  const { modality, limit = 20 } = req.query;

  let query = 'SELECT * FROM professionals WHERE is_verified = 1 AND availability_status != ?';
  const params: any[] = ['on_vacation'];

  if (modality && modality !== 'todas') {
    if (modality === 'online') {
      query += ' AND modality IN (?, ?)';
      params.push('online', 'both');
    } else if (modality === 'presencial') {
      query += ' AND modality IN (?, ?)';
      params.push('presential', 'both');
    }
  }

  query += ' LIMIT ?';
  params.push(parseInt(limit as string));

  const professionals = queryAll(query, params);

  let savedIds: number[] = [];
  if (req.user) {
    const saved = queryAll('SELECT professional_id FROM user_saved_professionals WHERE user_id = ?', [req.user.id]);
    savedIds = saved.map((s: any) => s.professional_id);
  }

  const result = professionals.map((prof: any) => ({
    _id: prof.id.toString(),
    fullName: prof.full_name,
    description: prof.description,
    specialties: parseJSON(prof.specialties, []),
    modality: prof.modality,
    languages: parseJSON(prof.languages, []),
    experienceYears: prof.experience_years,
    priceMin: prof.price_min,
    priceMax: prof.price_max,
    ratingAvg: prof.rating_avg,
    totalReviews: prof.total_reviews,
    availabilityStatus: prof.availability_status,
    location: prof.location,
    isSaved: savedIds.includes(prof.id),
  }));

  res.json(result);
});

app.get('/api/professionals/my', authenticateToken, (req: any, res: any) => {
  const professional = queryOne('SELECT * FROM professionals WHERE user_id = ?', [req.user.id]);

  if (!professional) {
    return res.json(null);
  }

  res.json({
    _id: professional.id.toString(),
    fullName: professional.full_name,
    description: professional.description,
    specialties: parseJSON(professional.specialties, []),
    modality: professional.modality,
    languages: parseJSON(professional.languages, []),
    experienceYears: professional.experience_years,
    priceMin: professional.price_min,
    priceMax: professional.price_max,
    isVerified: professional.is_verified,
    availabilityStatus: professional.availability_status,
  });
});

app.post('/api/professionals/register', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { full_name, linkedin_url, description, specialties, modality, languages,
    experience_years, price_min, price_max, is_volunteer, location } = req.body;

  const existing = queryOne('SELECT id FROM professionals WHERE user_id = ?', [userId]);
  if (existing) {
    return res.status(400).json({ error: 'Ya estás registrado como profesional' });
  }

  const result = runSql(`INSERT INTO professionals (
    user_id, full_name, linkedin_url, description, specialties, modality,
    languages, experience_years, price_min, price_max, is_volunteer, location,
    rating_avg, total_reviews, availability_status, is_verified
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'available', 0)`,
    [userId, full_name, linkedin_url, description, JSON.stringify(specialties || []),
      modality, JSON.stringify(languages || []), experience_years, price_min, price_max,
      is_volunteer ? 1 : 0, location]);

  saveDatabase();
  res.json({ success: true, id: result.lastInsertRowid });
});

// ============================================================================
// SESIONES
// ============================================================================

app.get('/api/sessions', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { status, limit = 10 } = req.query;

  let query = 'SELECT * FROM sessions WHERE user_id = ?';
  const params: any[] = [userId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY scheduled_at DESC LIMIT ?';
  params.push(parseInt(limit as string));

  const sessions = queryAll(query, params);

  const professionalIds = [...new Set(sessions.map((s: any) => s.professional_id))];
  const professionals = professionalIds.length > 0 
    ? queryAll(`SELECT id, full_name FROM professionals WHERE id IN (${professionalIds.map(() => '?').join(',')})`, professionalIds)
    : [];
  
  const profMap = new Map(professionals.map((p: any) => [p.id, p]));

  const result = sessions.map((session: any) => {
    const prof = profMap.get(session.professional_id);
    return {
      _id: session.id.toString(),
      scheduledAt: session.scheduled_at,
      completedAt: session.completed_at,
      modality: session.modality,
      status: session.status,
      sessionTitle: session.session_title,
      userNotes: session.user_notes,
      professionalName: prof?.full_name || 'Profesional',
    };
  });

  res.json(result);
});

app.get('/api/sessions/next', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const session = queryOne(`
    SELECT s.*, p.full_name as professional_name, p.specialties
    FROM sessions s
    JOIN professionals p ON p.id = s.professional_id
    WHERE s.user_id = ? AND s.status = 'scheduled' AND s.scheduled_at >= ?
    ORDER BY s.scheduled_at ASC
    LIMIT 1
  `, [userId, new Date().toISOString()]);

  if (!session) {
    return res.json(null);
  }

  res.json({
    _id: session.id.toString(),
    scheduledAt: session.scheduled_at,
    modality: session.modality,
    professionalName: session.professional_name,
    professionalSpecialties: parseJSON(session.specialties, []),
  });
});

app.post('/api/sessions', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { professional_id, scheduled_at, modality, session_title } = req.body;

  const result = runSql(
    'INSERT INTO sessions (user_id, professional_id, scheduled_at, modality, session_title, status) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, professional_id, scheduled_at, modality, session_title, 'scheduled']
  );

  saveDatabase();
  res.json({ success: true, id: result.lastInsertRowid });
});

// ============================================================================
// ENTRADAS DE DIARIO
// ============================================================================

app.get('/api/journal', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { limit = 10 } = req.query;

  const entries = queryAll(
    'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT ?',
    [userId, parseInt(limit as string)]
  );

  res.json(entries.map((entry: any) => ({
    _id: entry.id.toString(),
    mood: entry.mood,
    content: entry.content,
    tags: parseJSON(entry.tags, []),
    entryDate: entry.entry_date,
    createdAt: entry.created_at,
  })));
});

app.get('/api/journal/weekly-mood', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const entries = queryAll(
    'SELECT mood FROM journal_entries WHERE user_id = ? AND entry_date >= ?',
    [userId, oneWeekAgo.toISOString()]
  );

  const summary: Record<string, number> = {
    'very_good': 0, 'good': 0, 'neutral': 0, 'sad': 0, 'anxious': 0
  };

  entries.forEach((entry: any) => {
    if (entry.mood in summary) {
      summary[entry.mood]++;
    }
  });

  res.json(summary);
});

app.post('/api/journal', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { mood, content, tags, entry_date } = req.body;

  const result = runSql(
    'INSERT INTO journal_entries (user_id, mood, content, tags, entry_date) VALUES (?, ?, ?, ?, ?)',
    [userId, mood, content, JSON.stringify(tags || []), entry_date || new Date().toISOString()]
  );

  saveDatabase();
  res.json({ success: true, id: result.lastInsertRowid });
});

// ============================================================================
// METAS DE TERAPIA
// ============================================================================

app.get('/api/goals', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const goals = queryAll('SELECT * FROM therapy_goals WHERE user_id = ? ORDER BY created_at DESC', [userId]);

  res.json(goals.map((goal: any) => ({
    _id: goal.id.toString(),
    title: goal.title,
    description: goal.description,
    progressPercent: goal.progress_percent,
    isCompleted: !!goal.is_completed,
    completedAt: goal.completed_at,
  })));
});

app.post('/api/goals', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { title, description, professional_id } = req.body;

  const result = runSql(
    'INSERT INTO therapy_goals (user_id, professional_id, title, description) VALUES (?, ?, ?, ?)',
    [userId, professional_id || null, title, description]
  );

  saveDatabase();
  res.json({ success: true, id: result.lastInsertRowid });
});

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

// Middleware to check if user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// Get admin dashboard statistics
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: any, res: any) => {
  try {
    // Total users
    const totalUsers = queryOne('SELECT COUNT(*) as count FROM users WHERE role = ?', ['user']);
    
    // Total professionals
    const totalProfessionals = queryOne('SELECT COUNT(*) as count FROM professionals', []);
    
    // Active/verified professionals
    const activeProfessionals = queryOne('SELECT COUNT(*) as count FROM professionals WHERE is_verified = 1', []);
    
    // Pending verification professionals
    const pendingProfessionals = queryOne('SELECT COUNT(*) as count FROM professionals WHERE is_verified = 0', []);
    
    // Total sessions
    const totalSessions = queryOne('SELECT COUNT(*) as count FROM sessions', []);
    
    res.json({
      totalUsers: totalUsers?.count || 0,
      totalProfessionals: totalProfessionals?.count || 0,
      activeProfessionals: activeProfessionals?.count || 0,
      pendingProfessionals: pendingProfessionals?.count || 0,
      totalSessions: totalSessions?.count || 0
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Get all professionals (including pending)
app.get('/api/admin/professionals', authenticateToken, requireAdmin, (req: any, res: any) => {
  try {
    const professionals = queryAll(`
      SELECT p.*, u.email, u.handle, u.created_at as user_created
      FROM professionals p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    res.json(professionals.map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      email: p.email,
      handle: p.handle,
      fullName: p.full_name,
      specialties: parseJSON(p.specialties, []),
      languages: parseJSON(p.languages, []),
      modality: p.modality,
      experienceYears: p.experience_years,
      priceMin: p.price_min,
      priceMax: p.price_max,
      isVerified: p.is_verified === 1,
      isVolunteer: p.is_volunteer === 1,
      location: p.location,
      createdAt: p.created_at,
      userCreatedAt: p.user_created
    })));
  } catch (error) {
    console.error('Error getting professionals:', error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
});

// Verify a professional
app.post('/api/admin/professionals/:id/verify', authenticateToken, requireAdmin, (req: any, res: any) => {
  try {
    const { id } = req.params;
    runSql('UPDATE professionals SET is_verified = 1, verification_date = ? WHERE id = ?', 
      [new Date().toISOString(), id]);
    saveDatabase();
    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying professional:', error);
    res.status(500).json({ error: 'Error al verificar profesional' });
  }
});

// Reject/delete a professional
app.delete('/api/admin/professionals/:id', authenticateToken, requireAdmin, (req: any, res: any) => {
  try {
    const { id } = req.params;
    const professional = queryOne('SELECT user_id FROM professionals WHERE id = ?', [id]);
    if (professional) {
      runSql('DELETE FROM professionals WHERE id = ?', [id]);
      runSql('UPDATE users SET role = ? WHERE id = ?', ['user', professional.user_id]);
      saveDatabase();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting professional:', error);
    res.status(500).json({ error: 'Error al eliminar profesional' });
  }
});

// ============================================================================
// PUBLICACIONES DE COMUNIDAD
// ============================================================================

app.get('/api/community/posts', optionalAuth, (req: any, res: any) => {
  const { category, limit = 20 } = req.query;

  let query = "SELECT * FROM community_posts WHERE status = 'approved'";
  const params: any[] = [];

  if (category && category !== 'todos') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit as string));

  const posts = queryAll(query, params);

  res.json(posts.map((post: any) => {
    const likedBy = parseJSON<string[]>(post.liked_by, []);
    const hasLiked = req.user ? likedBy.includes(String(req.user.id)) : false;

    return {
      _id: post.id.toString(),
      author: post.is_anonymous ? 'Anonima' : post.author_name,
      isAnonymous: !!post.is_anonymous,
      category: post.category,
      content: post.content_text,
      audioUrl: post.audio_url,
      imageUrl: post.image_url,
      videoUrl: post.video_url,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      hasLiked,
      createdAt: post.created_at,
    };
  }));
});

app.get('/api/community/posts/:postId/comments', (req: any, res: any) => {
  const { limit = 20 } = req.query;

  const comments = queryAll(
    'SELECT * FROM post_comments WHERE post_id = ? AND status = ? ORDER BY created_at ASC LIMIT ?',
    [req.params.postId, 'active', parseInt(limit as string)]
  );

  res.json(comments.map((comment: any) => ({
    _id: comment.id.toString(),
    author: comment.is_anonymous ? 'Anonima' : comment.author_name,
    isAnonymous: !!comment.is_anonymous,
    content: comment.content,
    createdAt: comment.created_at,
  })));
});

app.post('/api/community/posts', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { content_text, category, is_anonymous } = req.body;

  const profile = queryOne('SELECT display_name FROM user_profiles WHERE user_id = ?', [userId]);
  const authorName = profile?.display_name || req.user.handle;

  const result = runSql(
    'INSERT INTO community_posts (user_id, author_name, is_anonymous, category, content_text, status) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, authorName, is_anonymous ? 1 : 0, category, content_text, 'pending']
  );

  saveDatabase();
  res.json({ success: true, id: result.lastInsertRowid });
});

// ============================================================================
// RECURSOS
// ============================================================================

app.get('/api/resources', (req: any, res: any) => {
  const { category, featured, limit = 20 } = req.query;

  let query = 'SELECT * FROM resources WHERE 1=1';
  const params: any[] = [];

  if (category && category !== 'todos') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (featured !== undefined) {
    query += ' AND is_featured = ?';
    params.push(featured === 'true' ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit as string));

  const resources = queryAll(query, params);

  res.json(resources.map((resource: any) => ({
    _id: resource.id.toString(),
    title: resource.title,
    description: resource.description,
    contentType: resource.content_type,
    category: resource.category,
    readingTimeMinutes: resource.reading_time_minutes,
    url: resource.url,
    isFeatured: !!resource.is_featured,
  })));
});

// ============================================================================
// CONTACTOS DE EMERGENCIA
// ============================================================================

app.get('/api/emergency-contacts', (req: any, res: any) => {
  const { country = 'España' } = req.query;

  const contacts = queryAll(
    'SELECT * FROM emergency_contacts WHERE country = ? AND is_active = 1',
    [country]
  );

  res.json(contacts.map((contact: any) => ({
    _id: contact.id.toString(),
    name: contact.name,
    phoneNumber: contact.phone_number,
    description: contact.description,
    isFree: !!contact.is_free,
    is24h: !!contact.is_24h,
  })));
});

// ============================================================================
// NOTIFICACIONES
// ============================================================================

app.get('/api/notifications', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { unreadOnly = false, limit = 20 } = req.query;

  let query = 'SELECT * FROM notifications WHERE user_id = ?';
  const params: any[] = [userId];

  if (unreadOnly === 'true') {
    query += ' AND is_read = 0';
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit as string));

  const notifications = queryAll(query, params);

  res.json(notifications.map((notif: any) => ({
    _id: notif.id.toString(),
    type: notif.type,
    title: notif.title,
    body: notif.body,
    isRead: !!notif.is_read,
    createdAt: notif.created_at,
  })));
});

app.get('/api/notifications/unread-count', authenticateToken, (req: any, res: any) => {
  const result = queryOne('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [req.user.id]);
  res.json({ count: result?.count || 0 });
});

// ============================================================================
// ESTADÍSTICAS
// ============================================================================

app.get('/api/user/stats', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;

  const journalEntries = queryOne('SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ?', [userId]);
  const completedSessions = queryOne("SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND status = 'completed'", [userId]);
  const goals = queryAll('SELECT * FROM therapy_goals WHERE user_id = ?', [userId]);
  const completedGoals = goals.filter((g: any) => g.is_completed).length;

  res.json({
    journalEntries: journalEntries?.count || 0,
    sessionsCompleted: completedSessions?.count || 0,
    goalsCompleted: completedGoals,
    totalGoals: goals.length,
    consecutiveDays: 0,
    wellbeingImprovement: 0,
  });
});

// ============================================================================
// CHAT - MENSAJES
// ============================================================================

// Get conversations for current user
app.get('/api/chat/conversations', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  
  // Get all unique conversations (messages where user is sender or receiver)
  const conversations = queryAll(`
    SELECT 
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        ELSE sender_id 
      END as other_user_id,
      messages.content as last_message,
      messages.created_at as last_message_time
    FROM messages
    WHERE sender_id = ? OR receiver_id = ?
    GROUP BY other_user_id
    ORDER BY last_message_time DESC
  `, [userId, userId, userId]);
  
  // Get user/professional details for each conversation
  const result = conversations.map((conv: any) => {
    const otherUser = queryOne(`
      SELECT u.id, u.handle, u.role, up.display_name
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?
    `, [conv.other_user_id]);
    
    if (!otherUser) return null;
    
    const unreadCount = queryOne(`
      SELECT COUNT(*) as count FROM messages 
      WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
    `, [conv.other_user_id, userId]);
    
    return {
      id: conv.other_user_id,
      recipientId: conv.other_user_id.toString(),
      recipientName: otherUser.display_name || otherUser.handle,
      recipientRole: otherUser.role === 'professional' ? 'therapist' : 'patient',
      lastMessage: conv.last_message,
      lastMessageTime: conv.last_message_time,
      unreadCount: unreadCount?.count || 0,
      isOnline: false
    };
  }).filter(Boolean);
  
  res.json(result);
});

// Get messages with a specific user
app.get('/api/chat/messages/:recipientId', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const recipientId = parseInt(req.params.recipientId);
  
  const messages = queryAll(`
    SELECT id, sender_id, receiver_id, content, is_read, created_at
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `, [userId, recipientId, recipientId, userId]);
  
  // Mark messages as read
  runSql(`UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?`, [recipientId, userId]);
  saveDatabase();
  
  const formattedMessages = messages.map((msg: any) => ({
    id: msg.id.toString(),
    senderId: msg.sender_id.toString(),
    content: msg.content,
    timestamp: msg.created_at,
    status: msg.is_read ? 'read' : 'delivered'
  }));
  
  res.json(formattedMessages);
});

// Send a message
app.post('/api/chat/messages', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { recipientId, content } = req.body;
  
  if (!recipientId || !content) {
    return res.status(400).json({ error: 'Recipient and content required' });
  }
  
  const result = runSql(`
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (?, ?, ?)
  `, [userId, recipientId, content]);
  
  saveDatabase();
  
  console.log(`💬 Mensaje enviado de usuario ${userId} a ${recipientId}: ${content}`);
  
  res.status(201).json({
    id: result.lastInsertRowid.toString(),
    senderId: userId.toString(),
    content,
    timestamp: new Date().toISOString(),
    status: 'sent'
  });
});

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// STATIC FILES - Sirve la aplicación React
// ============================================================================

// En producción (Render), intentar múltiples ubicaciones
const possibleClientPaths = [
  path.join(__dirname, '../../src/client/dist'),  // desde dist/server -> src/client/dist
  path.join(process.cwd(), 'src/client/dist'),   // desde raíz del proyecto
  path.join(__dirname, '../../dist/client'),     // desde dist/server -> dist/client
  path.join(process.cwd(), 'dist/client'),       // desde raíz del proyecto
];

let clientDistPath = '';
for (const p of possibleClientPaths) {
  if (fs.existsSync(p)) {
    clientDistPath = p;
    break;
  }
}

// Si no encuentra la carpeta, usar la primera opción por defecto
if (!clientDistPath) {
  clientDistPath = possibleClientPaths[0];
}

console.log('📁 Buscando archivos estáticos en:', clientDistPath);
console.log('📁 ¿Existe la carpeta?', fs.existsSync(clientDistPath));

// Verificar si existe la carpeta dist/client
if (fs.existsSync(clientDistPath)) {
  // Servir archivos estáticos
  app.use(express.static(clientDistPath, {
    index: false,  // No servir index.html automáticamente
    dotfiles: 'ignore'
  }));
  
  console.log('✅ Archivos estáticos configurados');
}

// Para todas las rutas que no sean API ni archivos estáticos, devolver index.html (SPA fallback)
app.get('*', (req: any, res: any) => {
  // No aplicar para rutas de API o archivos con extensión
  if (!req.path.startsWith('/api') && !req.path.includes('.')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Archivo no encontrado. Ejecuta npm run build.');
    }
  }
});

// Start server
initDatabase().then(() => {
  console.log('📦 Base de datos cargada');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(console.error);

export default app;
