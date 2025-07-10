'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Box,
} from '@mui/material';

const AddProductPage = () => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
  });

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      title: product.title,
      price: product.price,
      description: product.description,
      thumbnail: product.imagePreview || '/placeholder.png',
    };

    const existing = JSON.parse(localStorage.getItem('localProducts') || '[]');
    localStorage.setItem('localProducts', JSON.stringify([newProduct, ...existing]));

    router.push('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              name="title"
              label="Product Title"
              fullWidth
              variant="outlined"
              value={product.title}
              onChange={handleChange}
              required
            />
            <TextField
              name="price"
              label="Price"
              fullWidth
              type="number"
              variant="outlined"
              value={product.price}
              onChange={handleChange}
              required
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={product.description}
              onChange={handleChange}
              required
            />

            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {product.imagePreview && (
              <Box
                component="img"
                src={product.imagePreview}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: 250,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #ccc',
                }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Add Product
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProductPage;
