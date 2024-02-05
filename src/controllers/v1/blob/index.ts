import express from 'express'
import uploadAction from './upload-action'
import multer from 'multer'
export const MAX_BLOB_SIZE = 1024 * 1024 * 10 // 10 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'blob/')
  },
})

const upload = multer({ storage, limits: { fileSize: MAX_BLOB_SIZE } })

const router = express.Router()
router.post('/upload', upload.single('blob'), uploadAction)

export default router
