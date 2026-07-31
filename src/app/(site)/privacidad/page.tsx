import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hc-comercial.vercel.app'

export const metadata: Metadata = {
  title: 'Política de Privacidad | HC COMERCIAL',
  description: 'Política de privacidad y tratamiento de datos personales de HC COMERCIAL S.R.L.',
  alternates: { canonical: `${SITE_URL}/privacidad` },
  robots: { index: false, follow: false },
}

export default function PrivacidadPage() {
  const lastUpdated = '30 de julio de 2025'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 xl:px-0 py-16">
      <h1 className="text-3xl font-bold text-dark mb-2">Política de Privacidad</h1>
      <p className="text-sm text-dark-4 mb-10">Última actualización: {lastUpdated}</p>

      <div className="prose prose-sm max-w-none text-dark-3 space-y-8">

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">1. Responsable del tratamiento</h2>
          <p>
            <strong className="text-dark">HC COMERCIAL S.R.L.</strong> (en adelante &quot;HC COMERCIAL&quot;,
            &quot;nosotros&quot; o &quot;la empresa&quot;), con domicilio en la República del Paraguay,
            es responsable del tratamiento de los datos personales recabados a través de este sitio web
            y de nuestros canales de comunicación, incluyendo WhatsApp.
          </p>
          <p className="mt-2">
            Contacto: <a href="mailto:contacto@hccomercial.com.py" className="text-blue hover:underline">
              contacto@hccomercial.com.py
            </a> · WhatsApp: <a href="https://wa.me/595982800258" className="text-blue hover:underline">
              +595 982 800 258
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">2. Datos que recopilamos</h2>
          <p>Recopilamos los siguientes datos personales:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono / WhatsApp</li>
            <li>Dirección de entrega (ciudad, departamento, dirección)</li>
            <li>Historial de pedidos y productos consultados</li>
            <li>Mensajes enviados a través de WhatsApp Business</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">3. Finalidad del tratamiento</h2>
          <p>Utilizamos sus datos personales para:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Procesar y gestionar sus pedidos de productos</li>
            <li>Coordinar el envío y la entrega de sus compras</li>
            <li>Brindar atención al cliente a través de WhatsApp y otros canales</li>
            <li>Enviar notificaciones relacionadas con su pedido (confirmación, estado, entrega)</li>
            <li>Responder consultas sobre productos y servicios</li>
            <li>Cumplir con obligaciones legales y fiscales en Paraguay</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">4. WhatsApp Business y Meta</h2>
          <p>
            HC COMERCIAL utiliza <strong className="text-dark">WhatsApp Business API</strong>,
            proporcionada por Meta Platforms, Inc., para comunicarse con sus clientes.
            Al enviarnos un mensaje de WhatsApp o al proporcionarnos su número de teléfono,
            usted acepta que podamos contactarle a través de dicha plataforma para los fines
            descritos en esta política.
          </p>
          <p className="mt-2">
            Los mensajes enviados y recibidos a través de WhatsApp están sujetos adicionalmente
            a la{' '}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline"
            >
              Política de Privacidad de WhatsApp
            </a>
            {' '}y a los{' '}
            <a
              href="https://www.whatsapp.com/legal/business-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline"
            >
              Términos de Servicio de WhatsApp Business
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">5. Base legal del tratamiento</h2>
          <p>El tratamiento de sus datos se basa en:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-dark">Ejecución de contrato:</strong> para procesar sus pedidos y gestionar la relación comercial</li>
            <li><strong className="text-dark">Consentimiento:</strong> para el envío de comunicaciones comerciales y atención por WhatsApp</li>
            <li><strong className="text-dark">Obligación legal:</strong> para cumplir con la normativa fiscal y comercial vigente en Paraguay</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">6. Compartición de datos</h2>
          <p>
            No vendemos ni cedemos sus datos personales a terceros con fines comerciales.
            Sus datos pueden ser compartidos exclusivamente con:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Proveedores de logística y transporte para la entrega de sus pedidos</li>
            <li>Proveedores de servicios tecnológicos que nos asisten en la operación del sitio (Supabase, Vercel, Meta)</li>
            <li>Autoridades competentes cuando sea requerido por ley</li>
          </ul>
          <p className="mt-2">
            Todos nuestros proveedores tecnológicos están sujetos a acuerdos de procesamiento
            de datos y cuentan con políticas de privacidad propias.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">7. Conservación de datos</h2>
          <p>
            Conservamos sus datos personales durante el tiempo necesario para cumplir
            con las finalidades descritas en esta política y con las obligaciones legales
            aplicables en Paraguay. Los datos de pedidos se conservan por un mínimo de
            5 años conforme a la normativa fiscal vigente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">8. Sus derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-dark">Acceso:</strong> conocer qué datos personales tenemos sobre usted</li>
            <li><strong className="text-dark">Rectificación:</strong> corregir datos inexactos o incompletos</li>
            <li><strong className="text-dark">Cancelación / Supresión:</strong> solicitar la eliminación de sus datos</li>
            <li><strong className="text-dark">Oposición:</strong> oponerse al tratamiento de sus datos para fines de comunicación comercial</li>
          </ul>
          <p className="mt-2">
            Para ejercer cualquiera de estos derechos, contáctenos por WhatsApp al{' '}
            <a href="https://wa.me/595982800258" className="text-blue hover:underline">
              +595 982 800 258
            </a>{' '}
            o por email a{' '}
            <a href="mailto:contacto@hccomercial.com.py" className="text-blue hover:underline">
              contacto@hccomercial.com.py
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">9. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger sus datos personales
            contra el acceso no autorizado, la pérdida o la divulgación. Nuestros datos se
            almacenan en servidores seguros provistos por Supabase con cifrado en tránsito (TLS)
            y en reposo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">10. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Cuando lo hagamos,
            actualizaremos la fecha de &quot;Última actualización&quot; al inicio de esta página.
            Le recomendamos revisarla periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">11. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con el tratamiento de sus datos personales:
          </p>
          <ul className="list-none mt-2 space-y-1">
            <li>📧 <a href="mailto:contacto@hccomercial.com.py" className="text-blue hover:underline">contacto@hccomercial.com.py</a></li>
            <li>💬 <a href="https://wa.me/595982800258" className="text-blue hover:underline">+595 982 800 258</a></li>
          </ul>
        </section>

      </div>
    </div>
  )
}
