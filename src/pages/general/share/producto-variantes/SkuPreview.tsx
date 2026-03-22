type Props = {
    sku: string
}

export function SkuPreview({ sku }: Props) {

    return (

        <div className="space-y-2">

            <label className="font-semibold">
                SKU generado
            </label>

            <div className="
        border
        p-3
        rounded
        bg-gray-100
        text-gray-700
        overflow-x-auto
        whitespace-nowrap
      ">

                {sku || "Completa los atributos para generar SKU"}

            </div>

        </div>

    )

}