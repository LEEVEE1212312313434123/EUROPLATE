export default function EjemploPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lista de Productos</h1>
      <div className="flex gap-4 border-b pb-2 mb-4">
        <button className="px-3 py-1 border rounded bg-primary text-white">
          Lista Productos
        </button>
        <button className="px-3 py-1 border rounded">Descuentos</button>
      </div>
      <p>Contenido de productos...</p>
    </div>
  );
}
