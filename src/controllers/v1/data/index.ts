import express from 'express'
import addAction from './add-action'
import listAction from './list-action'

const router = express.Router()
router.post('/add', addAction)
router.post('/list', listAction)

export default router
