import { useFirebaseAuth } from '@/hooks'

export default function Dashboard() {
  const { user } = useFirebaseAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  )
}

export { metadata } from '@/data'
