import * as fs from 'fs'
import path from 'path'

/**
 * Get the page with the content
 * @param content The content to insert into the page
 */
export function getPage(content: string): string {
  const htmlPath = path.join(__dirname, '../templates/index.html')
  const html = fs.readFileSync(htmlPath, 'utf8')

  return html.replace('<!-- content -->', content)
}
