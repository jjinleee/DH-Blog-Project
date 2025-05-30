'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect,useState } from 'react'

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (status === 'loading') return
        if (!session || session.user.role !== 'ADMIN') {
            router.replace('/')
        }
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => setUsers(data))
    }, [session, status])

    return (
        <div>
            <h1>회원 목록</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} ({user.email}) - {user.role}</li>
                ))}
            </ul>
        </div>
    )
}