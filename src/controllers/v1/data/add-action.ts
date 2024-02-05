import { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({
      status: 'ok',
      value: 'hello world',
    })
  } catch (e) {
    next(e)
  }
}
