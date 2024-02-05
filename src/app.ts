import express, { Application } from 'express'
import cors from 'cors'
import v1Api from './controllers/v1'
import { errorHandler } from './middleware/errorHandler'

const app: Application = express()

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/v1', v1Api)

// Error handler should be the last middleware
app.use(errorHandler)

export default app
