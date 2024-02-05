import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'

/**
 * Removes the uploaded file at the provided filePath.
 *
 * @async
 * @param filePath Path to the file that should be removed.
 * @throws Will throw an error if the removal operation fails.
 */
async function removeUploadedFile(filePath: string): Promise<void> {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (e) {
    /* empty */
  }
}

/**
 * Uploads file, upload it to the storage, insert info into database and return the file info
 *
 * @param req Request
 * @param res Response
 * @param next Next function
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let filePath = ''

  try {
    const file = req.file
    filePath = file?.path || ''

    res.json({
      status: 'ok',
      path: filePath,
    })
  } catch (e) {
    next(e)
  } finally {
    await removeUploadedFile(filePath)
  }
}
