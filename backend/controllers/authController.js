// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ================= REGISTRO =================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario o correo ya está registrado' });
    }

    // 2. Encriptar la contraseña (¡NUNCA guardar en texto plano!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generar el Avatar único con la API externa de DiceBear
    const avatarUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${username}`;

    // 4. Guardar en base de datos
    const newUser = new User({
      username, email, password: hashedPassword, avatarUrl
    });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito', avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar al usuario
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    console.log("🚨 ATENCIÓN: El secreto JWT es:", process.env.JWT_SECRET);
    console.log("🚨 ATENCIÓN: Intentando firmar token para el usuario:", user.username);
    // 3. Generar Token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Lógica de seguridad
    if (user.role === 'admin') {
      // ADMIN: Recibe el token suelto en el JSON
      return res.json({ 
        message: 'Bienvenido Administrador', 
        token, 
        user: { username: user.username, role: user.role } 
      });
    } else {
      // JUGADOR NORMAL: Recibe el token oculto en una Cookie HttpOnly
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      return res.json({ 
        message: 'Login exitoso',
        token, 
        user: { username: user.username, avatarUrl: user.avatarUrl } 
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer <token>"

  if (!token) return res.status(403).json({ message: 'Token requerido para guardar partida' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Extraemos la ID del usuario para saber de quién es el puntaje
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};