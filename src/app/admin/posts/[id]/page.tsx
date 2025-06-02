'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    categoryId?: number;
    category?: {
        id: number;
        name: string;
    };
    imageUrl?: string;
}

interface Category {
    id: number;
    name: string;
}

export default function AdminPostDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editMode, setEditMode] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${id}`);
            const data = await res.json();
            if (res.ok) {
                setPost(data);
                setTitle(data.title);
                setContent(data.content);
                setCategoryId(data.categoryId?.toString() || '');
            }
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(setCategories);
    }, []);

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
                const updated = await fetch('/api/categories').then(res => res.json());
                setCategories(updated);
                router.refresh(); // <- Force refresh
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const handleUpdate = async () => {
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

        if (hasError || !post) return;

        const formData = new FormData();
        formData.append('id', post.id.toString());
        formData.append('title', title);
        formData.append('content', content);
        formData.append('categoryId', categoryId);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch('/api/posts', {
                method: 'PATCH',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to update post');
            }

            const updated = await res.json();
            const categoryName = categories.find(cat => cat.id === Number(categoryId))?.name || '';

            // Ensure the updated image bypasses cache
            const cacheBypassUrl = updated.imageUrl ? `${updated.imageUrl}?t=${Date.now()}` : null;

            setPost({
                ...updated,
                imageUrl: cacheBypassUrl,
                category: {
                  id: Number(categoryId),
                  name: categoryName,
                },
            });

            setEditMode(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    if (status === 'loading') return <p>로딩 중...</p>;
    if (!post) return <p className="text-red-600 p-6">게시글을 찾을 수 없습니다.</p>;

    return (
        <div className="max-w-3xl mx-auto mt-6 px-14 py-8 bg-white rounded-xl shadow-xl border border-gray-100 relative">
            <div className="mb-6">
              {editMode ? (
                  <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
              ) : (
                  <p className="text-gray-800 text-[20px] font-bold">{title}</p>
              )}
              {titleError && <p className="text-sm text-blue-700 mt-1">{titleError}</p>}
            </div>

            <div className="absolute top-6 right-10 text-[10px] text-gray-400 text-right">
              <p>
                작성일: {new Date(post.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {post.updatedAt && (
                <p>
                  수정일: {new Date(post.updatedAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>

            <div className="relative mb-6">
              <div className="flex items-center mb-1">
                <label className="block text-base font-semibold mb-2 text-gray-700 mr-2" htmlFor="category">카테고리</label>
                {editMode && (
                  <button onClick={() => setShowModal(true)} className="hover:text-gray-700">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-black ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              {editMode ? (
                <>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 appearance-none bg-white ${
                      categoryId ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    <option value="" disabled hidden>카테고리 선택</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </>
              ) : (
                <p className="bg-gray-50 text-gray-700 px-3 py-2 rounded-md">{post.category?.name || '없음'}</p>
              )}
              {categoryError && <p className="text-sm text-blue-700 mt-1">{categoryError}</p>}
            </div>
            {showModal && (
              <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm transition-transform duration-300 ease-in-out">
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
                      className="px-4 py-2 rounded-md transition-all duration-200 bg-gray-300 hover:bg-gray-400"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-md transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
                <label className="block text-base font-semibold mb-2 text-gray-700" htmlFor="content">내용</label>
                {editMode ? (
                    <textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows={10}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                ) : (
                    <p className="text-gray-800 px-4 whitespace-pre-wrap leading-relaxed text-base mt-2">{content}</p>
                )}
                {contentError && <p className="text-sm text-blue-700 mt-1">{contentError}</p>}
            </div>

            {editMode && (
              <div className="mb-6">
                <label className="block text-base font-semibold mb-2 text-gray-700" htmlFor="image">이미지 업로드</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {(imageFile || post?.imageUrl) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">미리보기:</p>
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : post.imageUrl}
                      alt="미리보기"
                      className="max-w-xs mt-2 rounded shadow"
                    />
                  </div>
                )}
              </div>
            )}

            {!editMode && post.imageUrl && (
              <div className="mb-6">
                <img src={post.imageUrl} alt="첨부 이미지" className="max-w-full rounded shadow" />
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-8">
                {editMode ? (
                    <>
                        <button
                            onClick={() => setEditMode(false)}
                            className="px-5 py-2.5 text-sm font-medium bg-gray-400 text-white rounded hover:bg-gray-500 transition-all duration-200"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                        >
                            수정 완료
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                        >
                            수정하기
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200"
                        >
                            삭제
                        </button>
                    </>
                )}
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">게시글 삭제</h3>
                        <p>정말 삭제하시겠습니까?</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 rounded-md transition-all duration-200 bg-gray-300 hover:bg-gray-400"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 rounded-md transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
                                onClick={async () => {
                                    if (!post) return;
                                    await fetch('/api/posts', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: post.id }),
                                    });
                                    setShowDeleteModal(false);
                                    router.push('/admin');
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}