interface Props {
    loading: boolean
    onFinalizar: () => void
}

export default function POSFinalizar({
    loading,
    onFinalizar
}: Props) {

    return (

        <button
            onClick={onFinalizar}
            disabled={loading}
            className="bg-blue-600 text-white w-full p-3 rounded font-semibold"
        >

            {loading
                ? "Procesando..."
                : "Finalizar Venta"}

        </button>

    )
}