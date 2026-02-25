export type VpnStatus = 'none' | 'active' | 'expired' | 'disabled'

export interface VpnOverviewResponse {
  hasKey: boolean
  vpnKey: string | null
  traffic: {
    upBytes: number
    downBytes: number
    totalBytes: number
    limitBytes: number | null
    usedPercent: number | null
    usedGb: number
  }
  connection: {
    isOnline: boolean
    lastOnlineAt: string | null
  }
  access: {
    status: VpnStatus
    hasAccess: boolean
    expiresAt: string | null
    daysLeft: number | null
  }
  trial: {
    canClaim: boolean
    claimedAt: string | null
    durationDays: number
  }
}

export interface VpnTrialResponse {
  message: string
  created: boolean
  data: VpnOverviewResponse
}
