'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Button,
} from '@mui/material';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getDeletedDummyIds, softDeleteDummyProduct } from '@/lib/deleteUtils';

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

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = () => {
    const local: Product[] = JSON.parse(localStorage.getItem('localProducts') || '[]');
    const filteredLocal = local.filter((p) => !p.deleted);
    setLocalProducts(filteredLocal);

    api
      .get('/products')
      .then((res) => {
        const deletedIds = getDeletedDummyIds();
        const dummyProducts: Product[] = res.data.products.map((p: Product) => {
          const edited = localStorage.getItem(`dummy-${p.id}`);
          return edited ? JSON.parse(edited) : p;
        });
        const filteredDummy = dummyProducts.filter((p) => !deletedIds.includes(p.id));
        setProducts(filteredDummy);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id: number) => {
    const isLocal = localProducts.find((p) => p.id === id);
    if (isLocal) {
      const updated = localProducts.map((p) =>
        p.id === id ? { ...p, deleted: true } : p
      );
      localStorage.setItem('localProducts', JSON.stringify(updated));
      setLocalProducts(updated.filter((p) => !p.deleted));
    } else {
      softDeleteDummyProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const merged: Product[] = [
    ...localProducts,
    ...products.filter((p) => !localProducts.some((lp) => lp.id === p.id)),
  ];

  const filteredProducts = merged.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', py: 5 }}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Explore Products
          </Typography>
          <Link href="/product/add">
            <Button variant="contained" color="primary">+ Add Product</Button>
          </Link>
        </Box>

        <Box mb={4}>
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Box>

        {loading ? (
          <Grid container justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Grid>
        ) : filteredProducts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={5}>
            No products found.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredProducts.map((product, index) => (
              <Grid key={product.id || index} item xs={12} sm={6} md={4}>
                <ProductCard
                  product={product}
                  deletable={
                    !!localProducts.find((p) => p.id === product.id) || !product.category
                  }
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
