export default function Loading2() {
  return (
    <div className="flex fixed w-full top-0 z-50 items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-700 font-semibold">Cargando sistema...</p>
      </div>
    </div>
  );
}