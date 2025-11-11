import { promises as fs } from 'fs'
import path from 'path'

export interface UserRecord {
  id: string
  email?: string
  name?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

type UsersMap = Record<string, UserRecord>

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json')

async function ensureUsersFile(): Promise<void> {
  try {
    await fs.access(usersFilePath)
  } catch {
    const dir = path.dirname(usersFilePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(usersFilePath, JSON.stringify({}, null, 2), 'utf8')
  }
}

export async function readUsersMap(): Promise<UsersMap> {
  await ensureUsersFile()
  try {
    const raw = await fs.readFile(usersFilePath, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as UsersMap) : {}
  } catch {
    return {}
  }
}

export async function writeUsersMap(users: UsersMap): Promise<void> {
  await ensureUsersFile()
  const content = JSON.stringify(users, null, 2)
  await fs.writeFile(usersFilePath, content, 'utf8')
}

export async function listUsers(): Promise<UserRecord[]> {
  const map = await readUsersMap()
  return Object.values(map)
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const map = await readUsersMap()
  return map[id] || null
}

export async function upsertUser(user: Omit<UserRecord, 'createdAt' | 'updatedAt'> & Partial<UserRecord>): Promise<UserRecord> {
  const map = await readUsersMap()
  const existing = map[user.id]
  const now = new Date().toISOString()
  const next: UserRecord = {
    id: user.id,
    email: user.email ?? existing?.email,
    name: user.name ?? existing?.name,
    stripeCustomerId: user.stripeCustomerId ?? existing?.stripeCustomerId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }
  map[user.id] = next
  await writeUsersMap(map)
  return next
}

export async function deleteUser(id: string): Promise<boolean> {
  const map = await readUsersMap()
  if (!map[id]) return false
  delete map[id]
  await writeUsersMap(map)
  return true
}



