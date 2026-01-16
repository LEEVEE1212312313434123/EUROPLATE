import { useState } from "react";

export function useComprasDialogs() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openDetail = (id: number) => setSelectedId(id);
  const closeDetail = () => setSelectedId(null);

  const openDelete = (compra: any) => {
    setDeleteTarget(compra);
    setConfirmOpen(true);
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setConfirmOpen(false);
  };

  return {
    selectedId,
    deleteTarget,
    confirmOpen,
    openDetail,
    closeDetail,
    openDelete,
    closeDelete,
    setConfirmOpen,
  };
}
