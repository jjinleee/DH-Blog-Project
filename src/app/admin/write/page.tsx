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
    const [newCategory, setNewCategory] = useState('');
    const [showModal, setShowModal] = useState(false);

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

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });
            if (res.ok) {
                setNewCategory('');
                setShowModal(false);
                fetchCategories(); // refresh list
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };


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
                    <div className="flex items-center mb-1">
                      <label className="block text-lg font-semibold  text-gray-700 mr-2" htmlFor="category">카테고리</label>
                      <button onClick={() => setShowModal(true)} className="hover:text-gray-700">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-black ml-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </span>
                      </button>
                    </div>
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
                    <span
                        className="pointer-events-none absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
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
            {showModal && (
                <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">새 카테고리 추가</h2>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
                            placeholder="카테고리 이름"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                추가
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}