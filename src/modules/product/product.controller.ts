import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as productService from './product.service';

const getProductImagePath = (file: Express.Multer.File) => `/uploads/products/${file.filename}`;

const toAbsoluteImageUrl = (req: Request, image?: string) => {
  if (!image) {
    return image;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return `${req.protocol}://${req.get('host')}${normalizedPath}`;
};

const serializeProduct = (req: Request, product: any) => {
  const productJson = typeof product.toJSON === 'function' ? product.toJSON() : product;

  return {
    ...productJson,
    image: toAbsoluteImageUrl(req, productJson.image),
  };
};

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  // 1. Copiamos el body para poder mutarlo de forma segura
  const productData = { ...req.body };

  // 2. Si Multer capturó un archivo, agregamos la ruta al objeto de datos
  if (req.file) {
    productData.image = getProductImagePath(req.file);
  }

  // 3. Enviamos los datos combinados al servicio
  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(serializeProduct(req, product));
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'category']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await productService.queryProducts(filter, options);
  res.send({
    ...result,
    results: result.results.map((product) => serializeProduct(req, product)),
  });
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(serializeProduct(req, product));
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    // 1. Copiamos el body para la actualización
    const updateData = { ...req.body };

    // 2. Si se envía una nueva imagen en la actualización, actualizamos la ruta
    if (req.file) {
      updateData.image = getProductImagePath(req.file);

      // NOTA: Aquí podrías agregar lógica adicional en el futuro
      // para borrar el archivo de imagen anterior del servidor
      // y así no acumular imágenes huérfanas en tu carpeta 'uploads'.
    }

    const product = await productService.updateProductById(new mongoose.Types.ObjectId(req.params['productId']), updateData);
    res.send(serializeProduct(req, product));
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    res.status(httpStatus.NO_CONTENT).send();

    // NOTA: De igual manera que en update, acá podrías buscar
    // el producto primero y usar 'fs.unlink' para borrar físicamente
    // la imagen asociada cuando se elimina el producto.
  }
});
