export async function authenticateUser(username: string, password: string) {
  // For demo purposes, we'll use hardcoded credentials
  // In a real application, this would be an API call
  return username === 'admin' && password === 'password';
}