import express from 'express'
import verifyGoogleAction from './verify-google-action'
import verifyFarcasterAction from './verify-farcaster-action'

const router = express.Router()
router.post('/google', verifyGoogleAction)
router.post('/farcaster', verifyFarcasterAction)

export default router
