import { Request, Response, NextFunction } from 'express'
import { ITestResponse } from './interface/ITestResponse'

export default async (req: Request, res: Response<ITestResponse>, next: NextFunction): Promise<void> => {
  try {
    res.json({
      status: 'ok',
      value: 'hello world',
    })
  } catch (e) {
    next(e)
  }
}
