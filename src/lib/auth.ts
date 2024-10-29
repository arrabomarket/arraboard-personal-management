import { prisma } from './db'

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || user.password !== password) {
    return false;
  }

  return true;
}