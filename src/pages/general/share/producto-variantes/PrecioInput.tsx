type Props = {
    precio: string
    setPrecio: (v: string) => void
}

export function PrecioInput({ precio, setPrecio }: Props) {

    return (

        <div className="space-y-2">

            <label className="font-semibold">
                Precio
            </label>

            <input
                type="number"
                className="
          border
          p-3
          rounded
          w-full
          overflow-x-auto
        "
                placeholder="Precio"
                value={precio}
                onChange={(e) =>
                    setPrecio(e.target.value)
                }
            />

        </div>

    )

}