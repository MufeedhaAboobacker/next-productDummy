
export const getDeletedDummyIds = (): number[] =>
  JSON.parse(localStorage.getItem('deletedDummyProductIds') || '[]');

export const softDeleteDummyProduct = (id: number) => {
  try {
    const raw = localStorage.getItem('deletedDummyProductIds') || '[]';

    let existing: unknown = JSON.parse(raw);

    if (!Array.isArray(existing)) {
      existing = [];
    }

    const safeArray = existing as number[];
    const updated = Array.from(new Set([...safeArray, id]));

    localStorage.setItem('deletedDummyProductIds', JSON.stringify(updated));
  } catch (error) {
    console.error('Error in softDeleteDummyProduct:', error);
    
    localStorage.setItem('deletedDummyProductIds', JSON.stringify([id]));
  }
};


export const softDeleteLocalProduct = (id: number) => {
  const local = JSON.parse(localStorage.getItem('localProducts') || '[]');
  const updated = local.map((p: any) =>
    String(p.id) === String(id) ? { ...p, deleted: true } : p
  );
  localStorage.setItem('localProducts', JSON.stringify(updated));
};