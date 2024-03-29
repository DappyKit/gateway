import app from './app'
import data from './info'
import verify from './verify'
import info from './info'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/data', data)
router.use('/verify', verify)
router.use('/info', info)

export default router
