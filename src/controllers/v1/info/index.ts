import express from 'express'
import smartAccountAction from './smart-account-action'

const router = express.Router()
router.get('/smart-account', smartAccountAction)

export default router
