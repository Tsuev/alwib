import * as aiServices from './aiServices'
import authServices from './authServices'
import * as downloaderServices from './downloaderServices'
import * as vpnServices from './vpnServices'

export default {
  ai: { ...aiServices },
  auth: { ...authServices },
  downloader: { ...downloaderServices },
  vpn: { ...vpnServices },
}
