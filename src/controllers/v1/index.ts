import app from './app'
import data from './info'
import verify from './verify'
import info from './info'
import farcaster from './farcaster'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/data', data)
router.use('/verify', verify)
router.use('/info', info)
router.use('/farcaster', farcaster)

export default router
