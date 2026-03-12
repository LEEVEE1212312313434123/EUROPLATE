export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      almacenes: {
        Row: {
          id: number
          nombre: string
          ubicacion: string | null
        }
        Insert: {
          id?: number
          nombre: string
          ubicacion?: string | null
        }
        Update: {
          id?: number
          nombre?: string
          ubicacion?: string | null
        }
        Relationships: []
      }
      atributo_valores: {
        Row: {
          atributo_id: number | null
          id: number
          valor: string
        }
        Insert: {
          atributo_id?: number | null
          id?: number
          valor: string
        }
        Update: {
          atributo_id?: number | null
          id?: number
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "atributo_valores_atributo_id_fkey"
            columns: ["atributo_id"]
            isOneToOne: false
            referencedRelation: "atributos"
            referencedColumns: ["id"]
          },
        ]
      }
      atributos: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string | null
          direccion: string | null
          email: string | null
          id: number
          nombre: string
          telefono: string | null
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: number
          nombre: string
          telefono?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: number
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      compra_detalles: {
        Row: {
          almacen_id: number | null
          cantidad: number | null
          compra_id: number | null
          id: number
          moneda_id: number | null
          precio: number | null
          precio_base: number | null
          variante_id: number | null
        }
        Insert: {
          almacen_id?: number | null
          cantidad?: number | null
          compra_id?: number | null
          id?: number
          moneda_id?: number | null
          precio?: number | null
          precio_base?: number | null
          variante_id?: number | null
        }
        Update: {
          almacen_id?: number | null
          cantidad?: number | null
          compra_id?: number | null
          id?: number
          moneda_id?: number | null
          precio?: number | null
          precio_base?: number | null
          variante_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compra_detalles_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compra_detalles_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compra_detalles_moneda_id_fkey"
            columns: ["moneda_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compra_detalles_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      compra_documentos: {
        Row: {
          compra_id: number | null
          created_at: string | null
          id: number
          nombre_archivo: string
          tipo_documento: string | null
        }
        Insert: {
          compra_id?: number | null
          created_at?: string | null
          id?: number
          nombre_archivo: string
          tipo_documento?: string | null
        }
        Update: {
          compra_id?: number | null
          created_at?: string | null
          id?: number
          nombre_archivo?: string
          tipo_documento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compra_documentos_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
        ]
      }
      compras: {
        Row: {
          estado: string | null
          fecha: string | null
          id: number
          moneda_id: number | null
          proveedor_id: number | null
          tipo_cambio: number | null
          tipo_compra: string | null
          total: number | null
        }
        Insert: {
          estado?: string | null
          fecha?: string | null
          id?: number
          moneda_id?: number | null
          proveedor_id?: number | null
          tipo_cambio?: number | null
          tipo_compra?: string | null
          total?: number | null
        }
        Update: {
          estado?: string | null
          fecha?: string | null
          id?: number
          moneda_id?: number | null
          proveedor_id?: number | null
          tipo_cambio?: number | null
          tipo_compra?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_moneda_id_fkey"
            columns: ["moneda_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      importaciones: {
        Row: {
          agente_aduanas: string | null
          compra_id: number | null
          costo_aduana: number | null
          costo_flete: number | null
          costo_seguro: number | null
          created_at: string | null
          fecha_embarque: string | null
          fecha_llegada: string | null
          id: number
          incoterm: string | null
          numero_contenedor: string | null
          puerto_destino: string | null
          puerto_origen: string | null
        }
        Insert: {
          agente_aduanas?: string | null
          compra_id?: number | null
          costo_aduana?: number | null
          costo_flete?: number | null
          costo_seguro?: number | null
          created_at?: string | null
          fecha_embarque?: string | null
          fecha_llegada?: string | null
          id?: number
          incoterm?: string | null
          numero_contenedor?: string | null
          puerto_destino?: string | null
          puerto_origen?: string | null
        }
        Update: {
          agente_aduanas?: string | null
          compra_id?: number | null
          costo_aduana?: number | null
          costo_flete?: number | null
          costo_seguro?: number | null
          created_at?: string | null
          fecha_embarque?: string | null
          fecha_llegada?: string | null
          id?: number
          incoterm?: string | null
          numero_contenedor?: string | null
          puerto_destino?: string | null
          puerto_origen?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "importaciones_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: true
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_movimientos: {
        Row: {
          almacen_id: number | null
          cantidad: number
          created_at: string | null
          id: number
          referencia_id: number | null
          referencia_tipo: string | null
          tipo_movimiento: string | null
          variante_id: number | null
        }
        Insert: {
          almacen_id?: number | null
          cantidad: number
          created_at?: string | null
          id?: number
          referencia_id?: number | null
          referencia_tipo?: string | null
          tipo_movimiento?: string | null
          variante_id?: number | null
        }
        Update: {
          almacen_id?: number | null
          cantidad?: number
          created_at?: string | null
          id?: number
          referencia_id?: number | null
          referencia_tipo?: string | null
          tipo_movimiento?: string | null
          variante_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_movimientos_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      monedas: {
        Row: {
          codigo: string
          id: number
          nombre: string
          simbolo: string | null
        }
        Insert: {
          codigo: string
          id?: number
          nombre: string
          simbolo?: string | null
        }
        Update: {
          codigo?: string
          id?: number
          nombre?: string
          simbolo?: string | null
        }
        Relationships: []
      }
      producto_atributos: {
        Row: {
          atributo_id: number | null
          id: number
          producto_id: number | null
        }
        Insert: {
          atributo_id?: number | null
          id?: number
          producto_id?: number | null
        }
        Update: {
          atributo_id?: number | null
          id?: number
          producto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_atributos_atributo_id_fkey"
            columns: ["atributo_id"]
            isOneToOne: false
            referencedRelation: "atributos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producto_atributos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_variantes: {
        Row: {
          activo: boolean | null
          codigo_barras: string | null
          id: number
          precio_venta: number | null
          producto_id: number | null
          sku: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo_barras?: string | null
          id?: number
          precio_venta?: number | null
          producto_id?: number | null
          sku?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo_barras?: string | null
          id?: number
          precio_venta?: number | null
          producto_id?: number | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_variantes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          created_at: string | null
          descripcion: string | null
          es_servicio: boolean | null
          id: number
          maneja_stock: boolean | null
          nombre: string
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          es_servicio?: boolean | null
          id?: number
          maneja_stock?: boolean | null
          nombre: string
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          es_servicio?: boolean | null
          id?: number
          maneja_stock?: boolean | null
          nombre?: string
          tipo?: string | null
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          email: string | null
          id: number
          nombre: string
          pais: string | null
          telefono: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          nombre: string
          pais?: string | null
          telefono?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          nombre?: string
          pais?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      series_comprobantes: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: number
          numero_actual: number | null
          serie: string
          tipo_comprobante: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: number
          numero_actual?: number | null
          serie: string
          tipo_comprobante: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: number
          numero_actual?: number | null
          serie?: string
          tipo_comprobante?: string
        }
        Relationships: []
      }
      tipos_cambio: {
        Row: {
          created_at: string | null
          fecha: string
          id: number
          moneda_destino_id: number | null
          moneda_origen_id: number | null
          tasa: number
        }
        Insert: {
          created_at?: string | null
          fecha: string
          id?: number
          moneda_destino_id?: number | null
          moneda_origen_id?: number | null
          tasa: number
        }
        Update: {
          created_at?: string | null
          fecha?: string
          id?: number
          moneda_destino_id?: number | null
          moneda_origen_id?: number | null
          tasa?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipos_cambio_moneda_destino_id_fkey"
            columns: ["moneda_destino_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tipos_cambio_moneda_origen_id_fkey"
            columns: ["moneda_origen_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
        ]
      }
      variante_atributos: {
        Row: {
          atributo_valor_id: number | null
          id: number
          variante_id: number | null
        }
        Insert: {
          atributo_valor_id?: number | null
          id?: number
          variante_id?: number | null
        }
        Update: {
          atributo_valor_id?: number | null
          id?: number
          variante_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variante_atributos_atributo_valor_id_fkey"
            columns: ["atributo_valor_id"]
            isOneToOne: false
            referencedRelation: "atributo_valores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variante_atributos_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      venta_detalles: {
        Row: {
          almacen_id: number | null
          cantidad: number | null
          id: number
          precio: number | null
          variante_id: number | null
          venta_id: number | null
        }
        Insert: {
          almacen_id?: number | null
          cantidad?: number | null
          id?: number
          precio?: number | null
          variante_id?: number | null
          venta_id?: number | null
        }
        Update: {
          almacen_id?: number | null
          cantidad?: number | null
          id?: number
          precio?: number | null
          variante_id?: number | null
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venta_detalles_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_detalles_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_detalles_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      venta_notas: {
        Row: {
          created_at: string | null
          id: number
          monto: number | null
          motivo: string | null
          numero: number | null
          serie: string | null
          tipo_nota: string | null
          venta_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          monto?: number | null
          motivo?: string | null
          numero?: number | null
          serie?: string | null
          tipo_nota?: string | null
          venta_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          monto?: number | null
          motivo?: string | null
          numero?: number | null
          serie?: string | null
          tipo_nota?: string | null
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venta_notas_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      venta_pagos: {
        Row: {
          id: number
          metodo_pago: string | null
          moneda_id: number | null
          monto: number | null
          venta_id: number | null
        }
        Insert: {
          id?: number
          metodo_pago?: string | null
          moneda_id?: number | null
          monto?: number | null
          venta_id?: number | null
        }
        Update: {
          id?: number
          metodo_pago?: string | null
          moneda_id?: number | null
          monto?: number | null
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venta_pagos_moneda_id_fkey"
            columns: ["moneda_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_pagos_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas: {
        Row: {
          cliente_id: number | null
          estado: string | null
          estado_pago: string | null
          fecha: string | null
          id: number
          moneda_id: number | null
          numero: number | null
          serie: string | null
          tipo_cambio: number | null
          tipo_comprobante: string | null
          total: number | null
        }
        Insert: {
          cliente_id?: number | null
          estado?: string | null
          estado_pago?: string | null
          fecha?: string | null
          id?: number
          moneda_id?: number | null
          numero?: number | null
          serie?: string | null
          tipo_cambio?: number | null
          tipo_comprobante?: string | null
          total?: number | null
        }
        Update: {
          cliente_id?: number | null
          estado?: string | null
          estado_pago?: string | null
          fecha?: string | null
          id?: number
          moneda_id?: number | null
          numero?: number | null
          serie?: string | null
          tipo_cambio?: number | null
          tipo_comprobante?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_moneda_id_fkey"
            columns: ["moneda_id"]
            isOneToOne: false
            referencedRelation: "monedas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
