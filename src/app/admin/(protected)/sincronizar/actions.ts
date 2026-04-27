'use server'

import { fullSync } from '@/lib/ascont-sync'

export async function runSyncAction() {
  return fullSync()
}
