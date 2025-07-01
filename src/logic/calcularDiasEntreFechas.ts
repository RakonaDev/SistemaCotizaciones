export function calcularDiasEntreFechas(fechaInicio: string | Date, fechaFin: string | Date): number {
  
  const inicio: Date = new Date(fechaInicio);
  const fin: Date = new Date(fechaFin);

  
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    console.error("Error: Una o ambas fechas proporcionadas son inválidas.");
    return 0;
  }

  
  if (inicio < fin) {
    
    const diferenciaMilisegundos: number = fin.getTime() - inicio.getTime();

    
    const milisegundosPorDia: number = 1000 * 60 * 60 * 24;
    const dias: number = diferenciaMilisegundos / milisegundosPorDia;

    
    return Math.floor(dias);
  } else {
    
    return 0;
  }
}