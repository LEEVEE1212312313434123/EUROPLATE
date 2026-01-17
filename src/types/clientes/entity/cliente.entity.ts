export interface ClienteEntity {
    id: number;
    nombre: string;
    tipo_documento: 'DNI' | 'RUC';
    numero_documento: string;
    telefono?: string;
    email?: string;
    fecha_registro: string;
}