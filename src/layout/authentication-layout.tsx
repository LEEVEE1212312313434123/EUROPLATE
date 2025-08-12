import { Outlet } from "react-router-dom"
import { GalleryVerticalEnd } from "lucide-react"

export default function AuthenticationLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden flex-col gap-4 p-6 md:p-10 bg-primary lg:flex">
        <div className="flex items-center gap-2 font-medium text-primary-foreground">
          <div className="bg-primary-foreground text-primary flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          EuroPlate
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-primary-foreground text-center">
            <h2 className="text-2xl font-bold">Bienvenido a EuroPlate</h2>
            <p className="mt-2 opacity-80">Disfruta de la mejor experiencia.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
