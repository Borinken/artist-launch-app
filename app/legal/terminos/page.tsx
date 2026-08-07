import LegalLayout from '../_components/LegalLayout';

export const metadata = { title: 'Términos y condiciones — Artist Launch OS' };

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="7 de agosto de 2026">
      <div className="note">
        Los campos <span className="fill">[COMPLETAR]</span> son datos del titular del servicio.
        Este documento no es asesoría legal — revísalo con un abogado antes de publicarlo, sobre todo
        si vas a operar en varias jurisdicciones a la vez.
      </div>

      <h2>1. Quiénes somos y qué contratas</h2>
      <p>
        Artist Launch OS es un servicio de gestión de carrera musical operado por{' '}
        <span className="fill">[COMPLETAR: nombre legal]</span> (contacto: hola@artistlaunchos.com). Al
        suscribirte a un plan (Starter, Professional o Elite), contratas acompañamiento y herramientas
        para registro de derechos, contratos, distribución y seguimiento de monetización, según el
        alcance descrito en la página de precios.
      </p>
      <p>
        Los gastos que cobran terceros (Copyright Office, SGAE, AGEDI, AIE, TuneCore y similares) se
        facturan aparte, al costo, y no están incluidos en la cuota mensual.
      </p>

      <h2>2. Suscripción, cobro y renovación automática</h2>
      <p>
        Los planes se facturan mensualmente por adelantado a través de Stripe y se renuevan
        automáticamente cada mes hasta que canceles. Si eres residente de California, la Ley de
        Renovación Automática de California te da derecho a cancelar en cualquier momento por un medio
        igual de sencillo al que usaste para contratar, y a recibir un aviso claro de la renovación
        automática — ambos derechos aplican aquí independientemente de dónde opere el servicio.
      </p>

      <h2>3. Derecho de desistimiento (usuarios en la Unión Europea)</h2>
      <p>
        Si contratas como consumidor desde la Unión Europea, tienes derecho a desistir del contrato
        dentro de los <strong>14 días naturales</strong> siguientes a la contratación, sin necesidad de
        justificar tu decisión, conforme a la normativa europea de protección de consumidores en
        contratos a distancia.
      </p>
      <p>
        Ese derecho de desistimiento se pierde si nos das tu consentimiento expreso para empezar a
        prestarte el servicio de inmediato (acceso inmediato al dashboard) y reconoces expresamente que,
        al hacerlo, pierdes el derecho de desistimiento una vez el servicio se haya ejecutado por
        completo. Te pedimos ese consentimiento de forma explícita en el momento de la contratación —
        antes de eso, no tienes acceso al servicio.
      </p>

      <h2>4. Cancelación</h2>
      <p>
        Puedes cancelar tu suscripción en cualquier momento desde tu panel de facturación o
        escribiéndonos a hola@artistlaunchos.com. La cancelación aplica al final del periodo ya pagado;
        no hacemos reembolsos parciales de meses ya facturados, salvo que la ley aplicable en tu país
        exija lo contrario.
      </p>

      <h2>5. Naturaleza de las plantillas de contrato</h2>
      <p>
        Las plantillas de contrato generadas dentro del dashboard (acuerdos de management, producción,
        publishing, NDA, cesión de derechos, etc.) son documentos base, no asesoría legal
        individualizada. Recomendamos revisión de un abogado antes de firmar cualquier contrato
        generado en la plataforma, especialmente cuando involucre cesión de derechos de autor, ya que
        el alcance legal de esa cesión varía según el país del firmante.
      </p>

      <h2>6. Tus datos y tu catálogo</h2>
      <p>
        Las canciones, split sheets, contratos y demás contenido que subes o generas en la plataforma
        siguen siendo de tu propiedad. Los usamos únicamente para prestarte el servicio contratado (por
        ejemplo, generar el PDF de un contrato o tramitar un registro que tú solicitaste). Si cancelas tu
        cuenta, puedes solicitar una copia de tus datos y su posterior eliminación escribiendo a
        hola@artistlaunchos.com — ver la Política de Privacidad para plazos de conservación exactos.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        No garantizamos que un registro ante un tercero (PRO, SGAE, Copyright Office, etc.) sea aprobado
        en un plazo determinado, ya que depende de esas entidades externas. Nuestra responsabilidad se
        limita a la gestión diligente del proceso y al importe efectivamente pagado por el servicio en
        los últimos 12 meses, salvo en los casos en que la ley no permita esa limitación.
      </p>

      <h2>8. Legislación aplicable</h2>
      <p>
        Estos términos se rigen por la legislación española, sin perjuicio de los derechos imperativos
        de protección al consumidor que puedan corresponder a usuarios residentes en la Unión Europea o
        en Estados Unidos según su jurisdicción local.
      </p>
    </LegalLayout>
  );
}
