'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditPostPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const postId = searchParams.get('id')

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        if (!postId) return

        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${postId}`)
            const data = await res.json()
            setTitle(data.title)
            setContent(data.content)
        }

        fetchPost()
    }, [postId])

    const handleUpdate = async () => {
        await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: postId, title, content }),
        })

        router.push('/admin')
    }

    if (status === 'loading') return <p>Loading...</p>
    if (!session || session.user.role !== 'ADMIN') {
        router.replace('/')
        return null
    }

    return (
        <div>
            <h1>글 수정</h1>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목"
            />
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="내용"
            />
            <button onClick={handleUpdate}>수정 완료</button>
        </div>
    )
}