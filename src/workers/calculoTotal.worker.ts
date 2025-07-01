
/*
export default () => {
  self.onmessage = (e: MessageEvent) => {
    const servicios = e.data.servicios || [];

    const total = servicios.reduce(
      (acc: number, servicio: any) => acc + (servicio.subtotal || 0),
      0
    );

    const gg = total * 0.1;
    const utilidad = total * 0.3;
    const precio_total = total + gg + utilidad;

    self.postMessage({ total, gg, utilidad, precio_total });
  };
};
*/
addEventListener('message', (e: MessageEvent) => {
  const servicios = e.data.servicios as Array<{ subtotal: number }>;
  const total = servicios.reduce((acc, s) => acc + (s.subtotal || 0), 0);
  const gg = total * 0.1;
  const utilidad = total * 0.3;
  const precio_total = total + gg + utilidad;
  postMessage({ total, gg, utilidad, precio_total });
});