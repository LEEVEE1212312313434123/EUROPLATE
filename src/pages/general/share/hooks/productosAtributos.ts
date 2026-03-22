import { useEffect, useState } from "react"
import { productoVariantesService } from "@/services/general/productoVariantes.service"

export function useProductoAtributos(productoId?: number) {

    const [atributos, setAtributos] = useState([])

    useEffect(() => {

        if (!productoId) return

        productoVariantesService
            .obtenerAtributos(productoId)
            .then(setAtributos)

    }, [productoId])

    return atributos

}