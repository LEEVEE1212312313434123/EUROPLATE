import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { ComprasTable } from "@/components/common/Logistica/ComprasTable";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CompraDetail } from "@/components/common/Logistica/CompraDetail";
import { useLogisticaCompras } from "@/hooks/useLogisticaCompras";
import { ImportacionService } from "@/services/editimportacion.service";

export default function ComprasLogistica() {
  const navigate = useNavigate();
  const { compras: importaciones, loading, error, reload: handleSave } =
    useLogisticaCompras();

  const [tablaCompras, setTablaCompras] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompra, setSelectedCompra] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ------------------------------
  // Cargar datos para ComprasTable
  // ------------------------------
  useEffect(() => {
    async function cargarTabla() {
      try {
        const data = await ImportacionService.getAll();
        setTablaCompras(data);
      } catch (err) {
        console.error("Error cargando ComprasTable:", err);
      }
    }
    cargarTabla();
  }, [importaciones]);

  // ------------------------------
  // Filtrado
  // ------------------------------
  const filteredCompras = useMemo(() => {
    return tablaCompras.filter((c) => {
      const searchMatch =
        !searchTerm ||
        (c.detalle ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.num_dua ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      if (filterType === "import" && c.pais_origen === "Perú") return false;
      if (filterType === "nacional" && c.pais_origen !== "Perú") return false;

      if (filterStatus === "Registrado" && c.estado !== "Registrado") return false;
      if (filterStatus === "En Transito" && c.estado !== "En Transito") return false;
      if (filterStatus === "Entregado" && c.estado !== "Entregado") return false;
      if (filterStatus === "Cancelado" && c.estado !== "Cancelado") return false;

      return true;
    });
  }, [tablaCompras, filterType, filterStatus, searchTerm]);

  // ------------------------------
  // Manejo de ver detalle
  // ------------------------------
  const handleView = async (compraId: number) => {
    try {
      const detalle = await ImportacionService.getById(compraId);
      if (detalle) {
        // Normalizamos datos para CompraDetail
        const compraFull = {
          ...detalle,
          datosEconomicos: {
            factura: detalle.factura,
            fechaVencimiento: detalle.fecha_vencimiento,
            cantidad: detalle.cantidad,
            unidad: detalle.unidad,
            valorFOB: detalle.valor_fob_usd,
            transporteMaritimo: detalle.transporte_maritimo_usd,
            valorCFR: detalle.valor_cfr_usd,
            liquidacion: {
              moneda: detalle.liquidacion_moneda,
              monto: detalle.liquidacion_monto,
            },
          },
          datosImportacion: {
            agente: detalle.agente_aduanas,
          },
          adjuntos: detalle.adjuntos?.map(a => ({
            ...a,
            nombre: a.nombre_archivo,
            url: a.url
          })) || [],
          productos: detalle.productos ?? [],
          estados: detalle.estados ?? [],
          logistica: {
            origen: detalle.pais_origen,
            puertoOrigen: detalle.puerto_origen,
            puertoDestino: detalle.puerto_destino,
            container: detalle.container,
          },
          proveedor: {
            nombre: detalle.proveedor,
            pais: detalle.pais_origen,
          }
        };

        console.log("🚀 Datos enviados a CompraDetail:", compraFull);

        setSelectedCompra(compraFull);
      }
    } catch (err) {
      console.error("Error cargando detalle:", err);
    }
  };
  // ------------------------------
  // Manejo de eliminar (cancelar)
  // ------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await ImportacionService.updateImportacion(
        deleteTarget.id,
        { estado: "Cancelado" },
        deleteTarget.productos || [],
        deleteTarget.adjuntos || [],
        deleteTarget.estados || []
      );
      setShowConfirm(false);
      setDeleteTarget(null);
      await handleSave();
    } catch (err) {
      console.error("Error cancelando importación:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Compras</h2>
          <p className="text-muted-foreground text-sm">
            Administra tus importaciones y compras nacionales
          </p>
        </div>
        <Button
          onClick={() => navigate("/logistica/addimport")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Importación
        </Button>
      </div>

      <div className="relative">
        <div className={`${selectedCompra ? "lg:pr-[380px]" : ""}`}>
          <Toolbar
            filterType={filterType}
            filterStatus={filterStatus}
            tabs={[
              { value: "all", label: `Todos (${tablaCompras.length})` },
              { value: "import", label: "Importación" },
            ]}
            selectOptions={[
              { value: "all", label: "Todos" },
              { value: "Pendientes", label: "Pendientes" },
              { value: "Registrado", label: "Registrado" },
              { value: "En Transito", label: "En Transito" },
              { value: "Entregado", label: "Entregado" },
              { value: "Cancelado", label: "Cancelado" },
            ]}
            searchTerm={searchTerm}
            searchPlaceholder="Buscar compra..."
            onFilterTypeChange={setFilterType}
            onFilterStatusChange={setFilterStatus}
            onSearchChange={setSearchTerm}
          />

          <div className="mt-6">
            <ComprasTable
              compras={filteredCompras}
              onDelete={(c) => {
                setDeleteTarget(c);
                setShowConfirm(true);
              }}
              onView={(c) => handleView(c.id)}
            />

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-primary font-semibold">
                    ¿Eliminar importación?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground font-normal">
                    {deleteTarget?.estado === "Entregado" ? (
                      <span className="text-foreground">
                        Esta importación ya fue ENTREGADA y no puede eliminarse.
                      </span>
                    ) : (
                      "Esta acción marcará la importación como CANCELADA. ¿Deseas continuar?"
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  {deleteTarget?.estado === "Entregado" ? (
                    <AlertDialogAction
                      onClick={() => setShowConfirm(false)}
                      className="bg-primary text-white hover:bg-primary/90 cursor-pointer"
                    >
                      Aceptar
                    </AlertDialogAction>
                  ) : (
                    <>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <AnimatePresence>
          {selectedCompra && (
            <motion.div
              key="compra-detail"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-full w-[320px] border-l bg-transparent"
            >
              <CompraDetail
                compra={selectedCompra}
                onClose={() => setSelectedCompra(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
