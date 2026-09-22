import bcrypt from 'bcryptjs'

export const passwordPolicy = { minLength: 8, maxLength: 128 } as const
const passwordHashRounds = 12

export const hashPassword = (password: string) => bcrypt.hash(password, passwordHashRounds)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)
