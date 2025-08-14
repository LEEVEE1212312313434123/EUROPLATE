import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export function PasswordRecoveryForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Button type="submit" className="w-full cursor-pointer">
            Enviar enlace de recuperación
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full text-black bg-white hover:bg-gray-100 border border-gray-300"
            onClick={() => navigate(-1)}
          >
            Regresar
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        Si no recibes el correo en unos minutos, revisa tu carpeta de spam o
        contacta con soporte técnico.
      </div>
    </form>
  )
}
