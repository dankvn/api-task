import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuración robusta para Windows con caracteres especiales
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta base manual (usa tu ruta EXACTA)
const basePath = 'C:\\Users\\D4nil0\\Desktop\\gg\\roles&permisos-api';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(basePath, 'uploads', 'tasks');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `file-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;