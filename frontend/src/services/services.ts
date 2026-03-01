import authServices from './authServices'
import * as downloaderServices from './downloaderServices'
import * as vpnServices from './vpnServices'

export default {
  auth: { ...authServices },
  downloader: { ...downloaderServices },
  vpn: { ...vpnServices },
}
