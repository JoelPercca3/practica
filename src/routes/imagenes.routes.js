import { uploadImage } from '../config/multer.js'
import { Router } from 'express'
import { getImageByFilename, getImageNames, uploadImageFn } from '../controllers/imagenes.controller.js'

const handleError = (err, req, res, next) => {
  console.log(err)
  res.status(400).json({ error: 'Solo se admiten imágenes' })
}

const router = Router()

router.get('/', getImageNames)

router.get('/:filename', getImageByFilename)

router.post('/upload', uploadImage.single('imagen'), handleError, uploadImageFn)

export default router
