'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import slugify from 'slugify'

export default function WritePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        if (status === 'loading') return
        if (!session || session.user.role !== 'ADMIN') {
            router.replace('/')
        }
    }, [session, status, router])

    useEffect(() => {
        setSlug(slugify(title, { lower: true }))
    }, [title])

    const handleSubmit = async () => {
        const finalSlug = slug || slugify(title, { lower: true })

        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, slug: finalSlug }),
        })
        router.replace('/')
    }

    return (
        <div>
            <h1>글쓰기</h1>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" />
            <button onClick={handleSubmit}>작성</button>
        </div>
    )
}