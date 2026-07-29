'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  { q: '¿Cuánto tarda el registro de una obra?', a: 'Depende del proveedor: una afiliación a PRO/SGAE puede tardar días, mientras que el registro de copyright formal suele tardar semanas o meses según la oficina correspondiente. Te mantenemos informado del estatus en tu dashboard.' },
  { q: '¿Qué pasa si ya tengo distribuidora?', a: 'Podemos trabajar en paralelo con tu distribuidora actual — nos enfocamos en registros, splits y contratos, y coordinamos contigo la metadata que ya envías a distribución.' },
  { q: '¿Trabajan con artistas fuera de PR, EE.UU. y España?', a: 'Nuestro proceso está optimizado para esos mercados por el tipo de registros que gestionamos (PRO/Copyright/MLC en EE.UU., SGAE/AIE/AGEDI en España). Si estás en otro país, escríbenos para evaluar tu caso.' },
  { q: '¿Qué pasa con mis regalías atrasadas?', a: 'Como parte de la auditoría inicial revisamos si hay regalías sin reclamar (ej. SoundExchange, mecánicas no cobradas) y te indicamos los pasos para reclamarlas.' },
  { q: '¿Necesito tener todo grabado para empezar?', a: 'No. Puedes empezar desde la etapa de composición — de hecho es el mejor momento para definir splits antes de grabar.' },
  { q: '¿Cómo se factura el servicio?', a: 'El plan mensual cubre gestión y acompañamiento. Los costos de terceros (Copyright Office, SGAE, TuneCore, etc.) se facturan aparte, al costo.' },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {FAQS.map((item, i) => (
        <div key={item.q} style={{ borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              padding: '20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              color: 'var(--text)', fontSize: 16, fontFamily: 'inherit',
            }}
          >
            {item.q}
            <span style={{ color: 'var(--accent)', fontSize: 20, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, padding: '0 4px 20px' }}>{item.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
