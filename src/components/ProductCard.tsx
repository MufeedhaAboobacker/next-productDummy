'use client';
import { FC } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  };
  deletable?: boolean;
  onDelete?: (id: number) => void;
}

const ProductCard: FC<ProductCardProps> = 
  ({ product, deletable, onDelete }) => ( 
  <Card
    sx={{
      maxWidth: 350,
      borderRadius: 3,
      boxShadow: 4,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <CardMedia
      component="img"
      height="200"
      image={product.thumbnail}
      alt={product.title}
      sx={{ objectFit: 'cover' }}
    />

    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {product.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1}>
        {product.description.length > 80
          ? `${product.description.substring(0, 80)}...`
          : product.description}
      </Typography>

      <Typography variant="h6" color="primary">
        ${product.price}
      </Typography>

      <Box mt={2}>
        <Link href={`/product/${product.id}`} passHref>
          <Button variant="contained" size="small" fullWidth>
            View Details
          </Button>
        </Link>
      </Box>

   
    </CardContent>
  </Card>
);

export default ProductCard;
