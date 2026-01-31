import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { ComprasToggle } from "@/components/common/Logistica/ComprasToggle";
import { ComprasNacionalesTable } from "@/components/common/Logistica/ComprasNacionalesTable";

import {
  useComprasBase,
  useComprasNacionales,
  useCompraDetail,
  useComprasDialogs,
  useComprasFilters,
  useComprasActions,
  ComprasTable,
  CompraDetail,
  Toolbar
} from "@/hooks/Compras";

type CompraView = "importacion" | "nacional";

export default function ComprasLogistica() {
  const navigate = useNavigate();

  /* ===============================
     TOGGLE VIEW
  =============================== */
  const [view, setView] = useState<CompraView>("importacion");

  /* ===============================
     DATA
  =============================== */
  const { data: comprasImport = [], isLoading, error } = useComprasBase();
  const { data: comprasNacionales = [] } = useComprasNacionales();

  /* ===============================
     DIALOGS / DETAIL
  =============================== */
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

  /* ===============================
     FILTERS (solo importaciones)
  =============================== */
  const {
    filteredCompras,
    searchTerm,
    filterType,
    filterStatus,
    setSearchTerm,
    setFilterType,
    setFilterStatus
  } = useComprasFilters(comprasImport);

  const { handleCancel } = useComprasActions();

  return (
    <>
      <ComprasToggle value={view} onChange={setView} />
      <ResourcePage
        title="Compras"
        subtitle="Administra tus importaciones y compras nacionales"
        isLoading={isLoading}
        error={error ? String(error) : null}

        /* ===============================
           HEADER
        =============================== */
        headerActions={
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/logistica/addimport")}>
              + Registrar Importación
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/logistica/addnational")}
            >
              + Compra Nacional
            </Button>
          </div>
        }

        /* ===============================
           TOOLBAR (solo importaciones)
        =============================== */
        toolbar={
          view === "importacion" ? (
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
                { value: "all", label: `Todos (${comprasImport.length})` },
                { value: "import", label: "Importación" }
              ]}
              selectOptions={[
                { value: "all", label: "Todos" },
                { value: "Registrado", label: "Registrado" },
                { value: "En Transito", label: "En Transito" },
                { value: "Entregado", label: "Entregado" },
                { value: "Cancelado", label: "Cancelado" }
              ]}
            />
          ) : null
        }
      >
        {/* ===============================
         TABLE + DETAIL
      =============================== */}
        <div className="relative w-full h-full flex">
          <div
            className={`flex-1 transition-all duration-300 ${compraDetail ? "mr-[320px]" : ""
              }`}
          >
            {view === "importacion" ? (
              <ComprasTable
                compras={filteredCompras}
                onDelete={openDelete}
                onView={(c) => openDetail(c.id)}
              />
            ) : (
              <ComprasNacionalesTable
                compras={comprasNacionales}
                onView={(id) => openDetail(id)}
                onDelete={openDelete}
                onEntregar={(id) =>
                  console.log("Entregar compra nacional:", id)
                }
              />

            )}
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

        {/* ===============================
         DELETE / CANCEL DIALOG
      =============================== */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-primary font-semibold">
                ¿Eliminar compra?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-muted-foreground font-normal">
                {deleteTarget?.estado === "Entregado"
                  ? "Esta compra ya fue ENTREGADA y no puede eliminarse."
                  : "Esta acción marcará la compra como CANCELADA. ¿Deseas continuar?"}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              {deleteTarget?.estado === "Entregado" ? (
                <AlertDialogAction onClick={closeDelete}>
                  Aceptar
                </AlertDialogAction>
              ) : (
                <>
                  <AlertDialogCancel onClick={closeDelete}>
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => handleCancel(deleteTarget!, closeDelete)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ResourcePage>
    </>);
}
