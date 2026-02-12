export interface MonedaEntity {
    id: number;
    codigo: string; // USD, PEN, EUR
    nombre: string;
    simbolo: string;
    created_at?: string;
}
