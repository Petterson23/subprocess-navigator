
import React, { ReactNode } from 'react';

interface ItemListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyState: ReactNode;
  isLoading: boolean;
  loadingState?: ReactNode;
  gridCols?: number;
}

const ItemList = <T extends { id: number | string }>({
  items,
  renderItem,
  emptyState,
  isLoading,
  loadingState,
  gridCols = 3,
}: ItemListProps<T>) => {
  if (isLoading) {
    return loadingState || (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return emptyState;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-4 lg:gap-6`}>
      {items.map(item => (
        <div key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
