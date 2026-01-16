import { useState } from "react";

export function useProductsDialogs() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openEdit = (p) => {
    setSelectedProduct(p);
    setEditOpen(true);
  };

  const openDelete = (p) => {
    setSelectedProduct(p);
    setDeleteOpen(true);
  };

  const closeDialogs = () => {
    setSelectedProduct(null);
    setEditOpen(false);
    setDeleteOpen(false);
  };

  return {
    editOpen,
    deleteOpen,
    selectedProduct,
    openEdit,
    openDelete,
    closeDialogs,
  };
}
