import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => any);
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface PaginatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
}

export function PaginatedTable<T>({ data, columns, pageSize = 10, actions }: PaginatedTableProps<T>) {
  const [page, setPage] = useState(0);

  const start = page * pageSize;
  const end = start + pageSize;
  const currentData = data.slice(start, end);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            {actions && <TableHead className="text-center">Acciones</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-6">
                No se encontraron registros.
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((row, i) => (
              <TableRow key={i} className="h-14 border-b hover:bg-muted/50 transition-colors">
                {columns.map((col, j) => (
                  <TableCell key={j} className={col.className}>
                    {col.render ? col.render(row) : typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor as keyof T]}
                  </TableCell>
                ))}
                {actions && <TableCell className="text-center">{actions(row)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>

          <Button variant="outline" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
