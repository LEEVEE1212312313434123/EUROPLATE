import Lottie from "lottie-react";
import developmentAnimation from "@/assets/animations/development.json";

export default function BuildForm() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-inner p-6">
      <Lottie
        animationData={developmentAnimation}
        loop={true}
        style={{ width: 250, height: 250 }}
      />

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">
        🚧 Proceso en desarrollo
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        Estamos trabajando para brindarte esta funcionalidad muy pronto.
      </p>
    </div>
  );
}
