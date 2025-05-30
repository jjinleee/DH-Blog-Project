'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminEditPage() {
    const { id } = useParams()
    const { data: session, status } = useSession()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        if (status === 'loading') return
        if (!session || session.user.role !== 'ADMIN') {
            router.replace('/')
        }
        fetch(`/api/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title)
                setContent(data.content)
            })
    }, [id, session, status])

    const handleUpdate = async () => {
        await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        })
        router.push('/')
    }

    const handleDelete = async () => {
        await fetch(`/api/posts/${id}`, { method: 'DELETE' })
        router.push('/')
    }

    return (
        <div>
            <h1>글 수정</h1>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <textarea value={content} onChange={e => setContent(e.target.value)} />
            <button onClick={handleUpdate}>수정</button>
            <button onClick={handleDelete}>삭제</button>
        </div>
    )
}