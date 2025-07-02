export function parseDateToTable(dateTimeString: string): string {
  if (!dateTimeString) {
    return '';
  }

  try {
    // Crea un objeto Date. Es importante que la cadena sea reconocida.
    // Reemplazamos el espacio con 'T' para que sea un formato ISO 8601 válido y Date lo interprete correctamente.
    const date = new Date(dateTimeString.replace(' ', 'T'));

    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error("Fecha inválida proporcionada:", dateTimeString);
      return '';
    }

    // Obtiene el día, mes y año
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es base 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error("Error al formatear la fecha:", e);
    return '';
  }
}