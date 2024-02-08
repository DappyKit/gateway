import app from './app'
import data from './data'
import verify from './verify'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/data', data)
router.use('/verify', verify)

export default router
