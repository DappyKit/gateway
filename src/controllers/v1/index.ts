import app from './app'
import blob from './blob'
import data from './data'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/blob', blob)
router.use('/data', data)

export default router
