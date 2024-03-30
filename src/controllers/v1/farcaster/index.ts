import express from 'express'
import verifyGetAction from './verify-get-action'
import verifyPostAction from './verify-post-action'

const router = express.Router()
router.get('/verify', verifyGetAction)
router.post('/verify', verifyPostAction)

export default router
