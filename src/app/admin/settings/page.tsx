'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
    id: string
    name: string | null
    email: string
    role: string
}

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (status === 'loading') return
        if (!session || session.user.role !== 'ADMIN') {
            router.replace('/')
            return
        }

        fetch(`/api/admin/users?search=${encodeURIComponent(search)}`)
            .then(async res => {
                if (!res.ok) {
                    const errText = await res.text()
                    throw new Error(errText)
                }
                return res.json()
            })
            .then(data => setUsers(data.users))
            .catch(err => {
                console.error('회원 목록 가져오기 실패:', err.message)
            })
    }, [session, status, search])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">회원 목록</h1>
            <input
                type="text"
                placeholder="닉네임 또는 이메일 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-2 mb-4 w-full max-w-md"
            />
            <ul>
                {users.length === 0 && <li>검색 결과가 없습니다.</li>}
                {users.map(user => (
                    <li key={user.id}>
                        {user.name || '(이름 없음)'} ({user.email}) - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    )
}