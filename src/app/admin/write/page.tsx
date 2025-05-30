'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import slugify from 'slugify'

interface Post {
    id: string
    title: string
    content: string
    createdAt: string
}

interface Category {
    id: string
    name: string
}

export default function WritePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        if (status === 'loading') return
        if (!session || session.user.role !== 'ADMIN') {
            router.replace('/')
        }
    }, [session, status, router])

    useEffect(() => {
        setSlug(slugify(title, { lower: true }))
    }, [title])

    useEffect(() => {
        fetchCategories()
    }, [])


    const fetchCategories = async () => {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
    }

    const handleSubmit = async () => {
        const finalSlug = slug || slugify(title, { lower: true })

        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, slug: finalSlug, categoryId }),
        })

        router.push('/admin')

        setTitle('')
        setContent('')
        setCategoryId('')
    }


    return (
        <div>
            <h1>글쓰기</h1>
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
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">카테고리 선택</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <button onClick={handleSubmit}>작성</button>
        </div>
    )
}