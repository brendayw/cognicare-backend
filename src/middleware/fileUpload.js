import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Formato de archivo no permitido'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export default upload
