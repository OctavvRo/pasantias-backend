import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// 1. Definir la ruta relativa desde este archivo hasta la carpeta deseada en la raíz
// Usamos path.resolve o path.join para evitar problemas de rutas relativas
const uploadDirectory = path.resolve(process.cwd(), 'uploads/products');

// 2. Crear el directorio automáticamente si no existe al levantar el servidor
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// 3. Configurar el motor de almacenamiento
// ... (imports y creación de carpeta se quedan igual)

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ... (el resto del archivo se queda igual)

// 4. Filtro de seguridad: aceptar únicamente formatos de imagen
const fileFilter = (_req: Request, _file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedMimeTypes.includes(_file.mimetype)) {
    cb(null, true);
  } else {
    // Si suben un PDF u otro archivo, Multer arrojará este error
    cb(new Error('Formato no soportado. Solo se permiten imágenes (jpeg, jpg, png, webp).'));
  }
};

// 5. Exportar el middleware inicializado
// eslint-disable-next-line import/prefer-default-export
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite máximo de 5MB por archivo
  },
});
