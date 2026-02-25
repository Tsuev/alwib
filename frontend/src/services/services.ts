import authServices from './authServices'
import * as vpnServices from './vpnServices'

export default {
  auth: { ...authServices },
  vpn: { ...vpnServices },
}
