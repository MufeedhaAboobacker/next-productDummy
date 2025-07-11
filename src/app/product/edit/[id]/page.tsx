'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category?: string;
  image?: string;
  deleted?: boolean;
}


const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLocalProduct, setIsLocalProduct] = useState(false);

  useEffect(() => {
    if (!id) return;

    const localProducts: Product[] = JSON.parse(localStorage.getItem('localProducts') || '[]');
    const localMatch = localProducts.find((p) => String(p.id) === String(id));

    if (localMatch) {
      setProduct(localMatch);
      setIsLocalProduct(true);
    } else {
      api.get(`/products/${id}`)
        .then(res => {
          setProduct(res.data as Product);
          setIsLocalProduct(false);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!product) return;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProduct((prev) => prev ? { ...prev, thumbnail: url } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (isLocalProduct) {
      const local: Product[] = JSON.parse(localStorage.getItem('localProducts') || '[]');
      const updated = local.map((p) =>
        String(p.id) === String(id) ? product : p
      );
      localStorage.setItem('localProducts', JSON.stringify(updated));
    } else {
      const updated = { ...product };
      localStorage.setItem(`dummy-${id}`, JSON.stringify(updated));
    }

    router.push(`/product/${id}`);
  };

  if (!product) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white mt-10 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={product.title}
          required
        />
        <input
          name="price"
          placeholder="Price"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={product.price}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={product.description}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt="Preview"
            className="w-full h-64 object-cover border rounded"
          />
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
