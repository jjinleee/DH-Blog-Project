'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
}

export default function EditPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        if (!id) return

        fetch(`/api/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title)
                setContent(data.content)
                setCategoryId(data.category?.id || '')
            })

        fetch('/api/categories')
            .then(res => res.json())
            .then(setCategories)
    }, [id])

    const handleUpdate = async () => {
        await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, content, categoryId }),
        })
        router.push('/admin/write')
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
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">카테고리 선택</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <br />
            <button onClick={handleUpdate}>수정 완료</button>
        </div>
    )
}