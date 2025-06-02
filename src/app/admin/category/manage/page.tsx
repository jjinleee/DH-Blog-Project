'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

export default function CategoryManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) {
      const added = await res.json();
      setCategories(prev => [...prev, added]);
      setNewCategory('');
    }
  };

  const updateCategory = async (id: number) => {
    if (!editName.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    });
    if (res.ok) {
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, name: editName } : c))
      );
      setEditId(null);
      setEditName('');
    }
  };

  const deleteCategory = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  return (
    <>
    <div className="p-6 max-w-lg mt-20 mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>
      <div className="space-y-6">
        <div className="mb-4 flex items-center space-x-3">
          <input
            type="text"
            placeholder="새 카테고리명"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="border px-3 py-2 rounded w-2/3 shadow-sm"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            추가
          </button>
        </div>
        <ul className="space-y-2">
          {categories.map(category => (
            <li
              key={category.id}
              className="flex justify-between items-center border border-gray-200 px-4 py-3 rounded-lg shadow-sm bg-gray-50"
            >
              {editId === category.id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border px-2 py-1 rounded flex-1 shadow-sm"
                  />
                  <button
                    onClick={() => updateCategory(category.id)}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditName('');
                    }}
                    className="text-gray-500 text-sm font-medium hover:text-gray-700 transition"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(category.id);
                        setEditName(category.name);
                      }}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-gray-500 text-sm font-medium hover:text-gray-700 transition"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    {showDeleteModal && deleteTargetId !== null && (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">카테고리 삭제</h3>
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
                const res = await fetch(`/api/categories/${deleteTargetId}`, { method: 'DELETE' });
                if (res.ok) {
                  setCategories(prev => prev.filter(c => c.id !== deleteTargetId));
                }
                setShowDeleteModal(false);
                setDeleteTargetId(null);
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}