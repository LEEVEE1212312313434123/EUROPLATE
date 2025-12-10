import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { ResourcePage } from "@/components/common/ResourcePage";
import {
  useComprasBase,
  useCompraDetail,
  useComprasDialogs,
  useComprasFilters,
  useComprasActions,
  ComprasTable,
  CompraDetail,
  Toolbar
} from "@/hooks/Compras";
 
export default function ComprasLogistica() {
  const navigate = useNavigate();
  const { data: comprasBase = [], isLoading, error } = useComprasBase();
  const {
    selectedId,
    deleteTarget,
    confirmOpen,
    openDetail,
    closeDetail,
    openDelete,
    closeDelete,
    setConfirmOpen
  } = useComprasDialogs();
  const { data: compraDetail } = useCompraDetail(selectedId ?? undefined);
  const {
    filteredCompras,
    searchTerm,
    filterType,
    filterStatus,
    setSearchTerm,
    setFilterType,
    setFilterStatus
  } = useComprasFilters(comprasBase);

  const { handleCancel } = useComprasActions();

  return (
    <ResourcePage
      title="Compras"
      subtitle="Administra tus importaciones y compras nacionales"
      isLoading={isLoading}
      error={error ? String(error) : null}
      headerActions={
        <Button onClick={() => navigate("/logistica/addimport")}>
          + Registrar Importación
        </Button>
      }
      toolbar={
        <Toolbar
          filterType={filterType}
          filterStatus={filterStatus}
          searchTerm={searchTerm}
          onFilterTypeChange={(v) =>
            setFilterType(v as "all" | "import" | "nacional")
          }
          onFilterStatusChange={setFilterStatus}
          onSearchChange={setSearchTerm}
          tabs={[
            { value: "all", label: `Todos (${comprasBase.length})` },
            { value: "import", label: "Importación" }
          ]}
          selectOptions={[
            { value: "all", label: "Todos" },
            { value: "Pendientes", label: "Pendientes" },
            { value: "Registrado", label: "Registrado" },
            { value: "En Transito", label: "En Transito" },
            { value: "Entregado", label: "Entregado" },
            { value: "Cancelado", label: "Cancelado" }
          ]}
        />
      }
    >
      <div className="relative w-full h-full flex">
        <div
          className={`flex-1 transition-all duration-300 ${
            compraDetail ? "mr-[320px]" : ""
          }`}
        >
          <ComprasTable
            compras={filteredCompras}
            onDelete={openDelete}
            onView={(c) => openDetail(c.id)}
          />
        </div>
        <AnimatePresence>
          {compraDetail && (
            <motion.div
              key="compra-detail"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-full w-[320px] bg-white"
            >
              <CompraDetail compra={compraDetail} onClose={closeDetail} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary font-semibold">
              ¿Eliminar importación?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-muted-foreground font-normal">
              {deleteTarget?.estado === "Entregado"
                ? "Esta importación ya fue ENTREGADA y no puede eliminarse."
                : "Esta acción marcará la importación como CANCELADA. ¿Deseas continuar?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            {deleteTarget?.estado === "Entregado" ? (
              <AlertDialogAction
                onClick={closeDelete}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Aceptar
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel onClick={closeDelete}>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => handleCancel(deleteTarget!, closeDelete)}
                  className="bg-muted hover:bg-muted/80"
                >
                  Eliminar
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResourcePage>
  );
}
