import express from 'express'
import verifyGoogleAction from './verify-google-action'

const router = express.Router()
router.post('/google', verifyGoogleAction)

export default router
