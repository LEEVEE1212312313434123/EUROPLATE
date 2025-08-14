import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(result.message, { description: "Bienvenido de nuevo" });
      navigate("/dashboard");
    } else {
      toast.error(result.message, { description: "Verifica tus credenciales e inténtalo de nuevo." });
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">HOLA, BIENVENIDO!</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu correo electrónico para acceder a tu cuenta
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              to="/recovery-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
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
        Acceso exclusivo para usuarios autorizados del sistema de gestión
      </div>
    </form>
  );
}
