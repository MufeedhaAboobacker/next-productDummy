'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { softDeleteDummyProduct } from '@/lib/deleteUtils';

export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number | string;
  thumbnail: string;
  category?: string;
  image?: string;
  deleted?: boolean;
}


const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLocalProduct, setIsLocalProduct] = useState(false);

  useEffect(() => {
    if (!id) return;

    const local: Product[] = JSON.parse(localStorage.getItem('localProducts') || '[]');
    const localMatch = local.find((p) => String(p.id) === String(id));

    if (localMatch) {
      setProduct(localMatch);
      setIsLocalProduct(true);
    } else {
      const editedDummy = localStorage.getItem(`dummy-${id}`);
      if (editedDummy) {
        setProduct(JSON.parse(editedDummy) as Product);
      } else {
        api.get(`/products/${id}`)
          .then((res) => setProduct(res.data as Product))
          .catch(console.error);
      }
    }
  }, [id]);

  const handleDelete = () => {
    if (!id || !product) return;

    if (isLocalProduct) {
      const local: Product[] = JSON.parse(localStorage.getItem('localProducts') || '[]');
      const updated = local.map((p) =>
        String(p.id) === String(id) ? { ...p, deleted: true } : p
      );
      localStorage.setItem('localProducts', JSON.stringify(updated));
    } else {
      softDeleteDummyProduct(Number(id));
    }

    router.push('/');
  };

  const handleBack = () => router.push('/');
  const handleEdit = () => {
    if (product) {
      router.push(`/product/edit/${product.id}`);
    }
  };

  if (!product) {
    return <div className="p-8 text-center text-gray-500 text-lg">Loading product...</div>;
  }

  if (product.deleted) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        This product has been deleted.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-medium shadow-sm"
          >
            <span className="text-lg">←</span> Back to Products
          </button>
          <span className="text-xs text-gray-400">Product ID: {product.id}</span>
        </div>

        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-72 sm:h-[400px] object-cover"
        />

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            {product.description}
          </p>

          <p className="text-2xl text-green-600 font-semibold mb-6">
            ${product.price}
          </p>

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
            >
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
