export interface Product {
  id: number | string;         
  title: string;
  description: string;
  price: number | string;      
  thumbnail: string;            
  category?: string;          
  image?: string;             
  deleted?: boolean;           
  brand?: string;               
  stock?: number;               
  rating?: number;                  
}


export const getDeletedDummyIds = (): number[] => {
  try {
    const raw = localStorage.getItem('deletedDummyProductIds');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const softDeleteDummyProduct = (id: number): void => {
  try {
    const raw = localStorage.getItem('deletedDummyProductIds') || '[]';
    const existing = JSON.parse(raw);
    const safeArray = Array.isArray(existing) ? existing : [];

    const updated = Array.from(new Set<number>([...safeArray, id]));
    localStorage.setItem('deletedDummyProductIds', JSON.stringify(updated));
  } catch (error) {
    console.error('Error in softDeleteDummyProduct:', error);
    localStorage.setItem('deletedDummyProductIds', JSON.stringify([id]));
  }
};

export const softDeleteLocalProduct = (id: number): void => {
  try {
    const raw = localStorage.getItem('localProducts') || '[]';
    const local: Product[] = JSON.parse(raw);
    const updated = local.map((p) =>
      String(p.id) === String(id) ? { ...p, deleted: true } : p
    );
    localStorage.setItem('localProducts', JSON.stringify(updated));
  } catch (error) {
    console.error('Error in softDeleteLocalProduct:', error);
  }
};
