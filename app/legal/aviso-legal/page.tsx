import LegalLayout from '../_components/LegalLayout';

export const metadata = { title: 'Aviso legal — Artist Launch OS' };

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso legal" updated="7 de agosto de 2026">
      <div className="note">
        Los campos marcados como <span className="fill">[COMPLETAR]</span> son datos de identificación
        del titular real del negocio (nombre legal, NIF/CIF, domicilio) que solo tú puedes rellenar.
        Este aviso no sustituye asesoría legal — revísalo con un gestor o abogado antes de publicarlo.
      </div>

      <h2>1. Titular del sitio</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información
        y de Comercio Electrónico (LSSICE), se informa de los siguientes datos:
      </p>
      <ul>
        <li>Titular / razón social: <span className="fill">[COMPLETAR: nombre legal o razón social]</span></li>
        <li>NIF / CIF: <span className="fill">[COMPLETAR]</span></li>
        <li>Domicilio: <span className="fill">[COMPLETAR: dirección postal]</span></li>
        <li>Correo de contacto: hola@artistlaunchos.com</li>
        <li>Nombre comercial: Artist Launch OS</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio ofrece un servicio de gestión de carrera musical: registro de derechos de autor y
        entidades de gestión (PRO/SGAE, copyright, MLC/AIE/AGEDI), organización de split sheets y
        contratos, seguimiento de distribución digital y monetización, dirigido a artistas
        independientes en Puerto Rico, Estados Unidos y España.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio atribuye la condición de usuario y supone la aceptación de este
        aviso legal. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios,
        a no utilizarlos para fines ilícitos y a facilitar información veraz al completar su perfil,
        dado que los registros de derechos que se tramitan dependen de esa información.
      </p>

      <h2>4. Propiedad intelectual del sitio</h2>
      <p>
        El diseño, código, textos, marca "Artist Launch OS" y demás contenidos propios de este sitio
        son titularidad de <span className="fill">[COMPLETAR: titular]</span> y están protegidos por
        la normativa de propiedad intelectual. Esto es independiente de los derechos de autor sobre las
        obras musicales de cada artista usuario, que en todo momento permanecen en titularidad del
        artista — ver la Política de Privacidad y los Términos y Condiciones para más detalle sobre el
        tratamiento de esos datos.
      </p>

      <h2>5. Enlaces a terceros</h2>
      <p>
        El sitio referencia y se apoya en servicios de terceros (entidades de gestión de derechos como
        SGAE/ASCAP/BMI/AIE/AGEDI, distribuidoras digitales como TuneCore, y proveedores de
        infraestructura como Supabase y Stripe). No somos responsables del contenido o las políticas de
        esos sitios de terceros.
      </p>

      <h2>6. Legislación aplicable y jurisdicción</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia derivada del
        acceso o uso de este sitio, las partes se someten a los juzgados y tribunales de{' '}
        <span className="fill">[COMPLETAR: ciudad/provincia]</span>, salvo que la normativa de
        protección de consumidores aplicable disponga un fuero distinto para usuarios de otras
        jurisdicciones.
      </p>
    </LegalLayout>
  );
}
