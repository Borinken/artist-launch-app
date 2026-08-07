import LegalLayout from '../_components/LegalLayout';

export const metadata = { title: 'Política de privacidad — Artist Launch OS' };

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updated="7 de agosto de 2026">
      <div className="note">
        Los campos <span className="fill">[COMPLETAR]</span> identifican al responsable real del
        tratamiento. Esta política describe qué se recoge y por qué, conforme al RGPD (UE) 2016/679 y
        la LOPDGDD española — revísala con un asesor antes de publicarla.
      </div>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        <span className="fill">[COMPLETAR: nombre legal / NIF]</span>, con domicilio en{' '}
        <span className="fill">[COMPLETAR: dirección]</span>, es responsable del tratamiento de los
        datos personales recogidos a través de Artist Launch OS. Contacto: hola@artistlaunchos.com.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <ul>
        <li><strong>Identificación:</strong> nombre legal, nombre artístico, email, país.</li>
        <li><strong>Fiscales:</strong> NIF/SSN u otro identificador fiscal, necesario para tramitar registros ante PRO/SGAE, Copyright Office u otras entidades.</li>
        <li><strong>Financieros:</strong> datos de facturación gestionados por Stripe (nunca almacenamos números de tarjeta directamente).</li>
        <li><strong>Contractuales:</strong> split sheets, contratos, cartas de instrucción de pago (LOD) y sus firmantes.</li>
        <li><strong>De catálogo:</strong> canciones, metadata de distribución, estatus de registros y datos de monetización que el artista introduce o autoriza.</li>
        <li><strong>Técnicos:</strong> cookies de sesión estrictamente necesarias para mantener el inicio de sesión (ver sección 7).</li>
      </ul>

      <h2>3. Finalidad y base legal</h2>
      <ul>
        <li><strong>Ejecución del contrato de servicio</strong> (art. 6.1.b RGPD): gestionar registros, contratos, distribución y facturación.</li>
        <li><strong>Consentimiento</strong> (art. 6.1.a): comunicaciones de marketing/newsletter, si el usuario se suscribe voluntariamente.</li>
        <li><strong>Interés legítimo</strong> (art. 6.1.f): prevención de fraude y seguridad de la cuenta.</li>
        <li><strong>Obligación legal</strong> (art. 6.1.c): conservación de datos de facturación según normativa fiscal.</li>
      </ul>

      <h2>4. Con quién compartimos datos</h2>
      <p>
        No vendemos datos personales. Compartimos los datos estrictamente necesarios con los siguientes
        encargados del tratamiento, cada uno bajo su propio acuerdo de encargo (DPA):
      </p>
      <ul>
        <li><strong>Supabase</strong> — base de datos y autenticación. DPA: supabase.com/legal/dpa.</li>
        <li><strong>Stripe</strong> — procesamiento de pagos y facturación. DPA: stripe.com/legal/dpa.</li>
        <li>Entidades de gestión de derechos y distribuidoras (SGAE, ASCAP, BMI, AIE, AGEDI, The MLC, TuneCore, etc.), únicamente los datos necesarios para tramitar el registro o servicio que el propio artista solicita.</li>
      </ul>
      <p>
        Parte de esta infraestructura puede procesar datos fuera del Espacio Económico Europeo. Cuando
        eso ocurre, nos apoyamos en las garantías del proveedor (cláusulas contractuales tipo u otro
        mecanismo de transferencia reconocido por el RGPD).
      </p>

      <h2>5. Plazo de conservación</h2>
      <p>
        Conservamos los datos de la cuenta mientras esté activa. Tras la cancelación, se conservan
        únicamente los datos que la normativa fiscal/contable obligue a retener (facturación) por el
        plazo legal correspondiente; el resto de datos de catálogo, contratos y split sheets se
        conservan mientras exista una obra o contrato vigente asociado, salvo solicitud expresa de
        supresión conforme a la sección 6.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, portabilidad y
        limitación del tratamiento escribiendo a hola@artistlaunchos.com. También puedes presentar una
        reclamación ante la Agencia Española de Protección de Datos (AEPD, aepd.es) si consideras que el
        tratamiento no se ajusta a la normativa.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Este sitio usa únicamente cookies técnicas estrictamente necesarias para mantener tu sesión
        iniciada (Supabase Auth) — no usamos cookies de analítica ni de publicidad. Conforme al artículo
        22.2 de la LSSICE, las cookies estrictamente necesarias para prestar el servicio solicitado no
        requieren consentimiento previo. Si en el futuro incorporamos analítica o publicidad, añadiremos
        un panel de consentimiento antes de activarlas.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        El servicio está dirigido a artistas mayores de edad o a su representante legal (manager,
        productor, madre/padre/tutor) cuando el artista sea menor. Si gestionas la cuenta de un artista
        menor de edad, confirmas que cuentas con la autorización legal necesaria.
      </p>

      <h2>9. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios legales o del servicio. Publicaremos la
        fecha de la última actualización en la parte superior de esta página.
      </p>
    </LegalLayout>
  );
}
