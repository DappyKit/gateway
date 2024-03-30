import { getPublicUrl } from '../utils/url'
import { getPage } from '../utils/page'

export default function done(): string {
  const previewImage = getPublicUrl(`static/done.jpg`)
  const appUrl = getPublicUrl(`v1/farcaster/verify`)
  const message = encodeURIComponent(`🚀 Awesome! I just created a @dappykit account without leaving Warpcast!`)
  const buttonUrl = `https://warpcast.com/~/compose?text=${message}&embeds[]=${appUrl}`
  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    <meta name="fc:frame:button:1" content="Publish">
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${buttonUrl}" />
    `

  return getPage(content)
}
