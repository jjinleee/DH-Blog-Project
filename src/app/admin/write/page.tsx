'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import slugify from 'slugify'

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
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const [categoryError, setCategoryError] = useState('');

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
        let hasError = false;

        if (!title.trim()) {
            setTitleError('제목을 입력해주세요.');
            hasError = true;
        } else {
            setTitleError('');
        }

        if (!content.trim()) {
            setContentError('내용을 입력해주세요.');
            hasError = true;
        } else {
            setContentError('');
        }

        if (!categoryId) {
            setCategoryError('카테고리를 선택해주세요.');
            hasError = true;
        } else {
            setCategoryError('');
        }

        if (hasError) return;

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
        <div className="max-w-3xl mx-auto mt-5 px-10 py-3 bg-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Post</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-lg font-semibold mb-1 text-gray-700" htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {titleError && <p className="text-sm text-blue-700 mt-1">{titleError}</p>}
                </div>
                <div className="relative">
                    <label className="block text-lg font-semibold mb-1 text-gray-700" htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 appearance-none bg-white text-gray-900"
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                    {categoryError && <p className="text-sm text-blue-700 mt-1">{categoryError}</p>}
                </div>
                <div>
                    <label className="block text-lg font-semibold mb-1 text-gray-700" htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows={10}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {contentError && <p className="text-sm text-blue-700 mt-1">{contentError}</p>}
                </div>

                <div className="text-right">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white text-base font-medium px-6 py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        작성하기
                    </button>
                </div>
            </div>
        </div>
    )
}