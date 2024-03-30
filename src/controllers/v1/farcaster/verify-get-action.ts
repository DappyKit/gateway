import { Request, Response, NextFunction } from 'express'
import main from './page/main'

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send(main())
  } catch (e) {
    next(e)
  }
}
