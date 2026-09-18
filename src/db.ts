import { neon } from '@neondatabase/serverless'
export {db} from './db/index';

let client: ReturnType<typeof neon>

export async function getClient() {
  if (!process.env.DATABASE_URL) {
    return undefined
  }
  if (!client) {
    client = await neon(process.env.DATABASE_URL!)
  }
  return client
}

