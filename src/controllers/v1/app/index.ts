import express from 'express'
import testAction from './test-action'

const router = express.Router()
router.get('/test', testAction)

export default router
