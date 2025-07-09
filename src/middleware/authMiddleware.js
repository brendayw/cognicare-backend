import AuthToken from '../utils/authToken.js'

const checkJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      message: 'No se proporciono el token'
    })
  }

  try {
    const decoded = AuthToken.verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido o expirado'
    })
  }
}

export default checkJwt
