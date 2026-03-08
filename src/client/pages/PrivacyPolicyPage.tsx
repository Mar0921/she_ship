import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import Page from '@/client/components/Page';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <Page>
      {/* Custom Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-purple-700">PurpleMatch</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-700">POLÍTICA DE PRIVACIDAD</CardTitle>
            <p className="text-center text-gray-500 mt-2">PURPLEMATCH</p>
            <p className="text-center text-sm text-gray-400">Última actualización: 2026</p>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium">
                La privacidad y seguridad de las usuarias es una prioridad para PurpleMatch. Esta política explica cómo recopilamos, usamos y protegemos la información dentro de la plataforma.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">1. Información que Recopilamos</h2>
              <p className="pl-4">
                Podemos recopilar los siguientes tipos de datos de nuestras usuarias:
              </p>
              
              <div className="pl-4 mt-3 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de registro</h3>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Nombre o apodo</li>
                    <li>Correo electrónico</li>
                    <li>Contraseña cifrada</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de perfil</h3>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Edad</li>
                    <li>Ubicación aproximada</li>
                    <li>Idioma preferido</li>
                    <li>Ocupación</li>
                    <li>Preferencias terapéuticas</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información emocional y terapéutica</h3>
                  <p className="text-sm mt-1">Dependiendo del uso de la plataforma:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Entradas del diario emocional</li>
                    <li>Objetivos terapéuticos</li>
                    <li>Historial de sesiones</li>
                    <li>Notas personales</li>
                  </ul>
                  <p className="text-sm mt-2 text-gray-600">Estos datos pueden almacenarse cifrados para mayor seguridad.</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Actividad dentro de la plataforma</h3>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Publicaciones en la comunidad</li>
                    <li>Comentarios</li>
                    <li>Interacciones con contenido</li>
                    <li>Profesionales guardados</li>
                    <li>Progreso en la plataforma</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">Información de Profesionales</h2>
              <p className="pl-4">En el caso de nuestras profesionales:</p>
              
              <div className="pl-4 mt-3 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de identificación profesional</h3>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Nombre completo del profesional</li>
                    <li>Edad</li>
                    <li>Identificador interno del perfil dentro de la plataforma</li>
                    <li>Cuenta de usuario asociada</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de contacto profesional</h3>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Correo electrónico asociado a la cuenta</li>
                    <li>Perfil profesional en plataformas externas (por ejemplo LinkedIn)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de verificación profesional</h3>
                  <p className="text-sm mt-1">Para garantizar la seguridad de las usuarias, PurpleMatch puede solicitar documentación que confirme la formación y habilitación profesional, incluyendo:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Documento de identidad</li>
                    <li>Tarjeta profesional o licencia para ejercer</li>
                    <li>Diplomas o certificados académicos</li>
                    <li>Documentos de acreditación profesional</li>
                  </ul>
                  <p className="text-sm mt-2 text-gray-600">Esta información es utilizada exclusivamente para el proceso de verificación interna.</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información del perfil profesional</h3>
                  <p className="text-sm mt-1">Los profesionales pueden proporcionar información que será visible para las usuarias dentro de la plataforma, como:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Descripción profesional o enfoque terapéutico</li>
                    <li>Especialidades o áreas de atención (por ejemplo: ansiedad, trauma, relaciones, violencia psicológica)</li>
                    <li>Idiomas en los que puede ofrecer atención</li>
                    <li>Años de experiencia profesional</li>
                    <li>Motivaciones o enfoque personal de trabajo terapéutico</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información sobre modalidades de atención</h3>
                  <p className="text-sm mt-1">Para facilitar el proceso de matching con las usuarias, también se recopila información sobre:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Modalidad de atención (online, presencial o ambas)</li>
                    <li>Disponibilidad para nuevas pacientes</li>
                    <li>Estado actual de disponibilidad</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información económica del servicio</h3>
                  <p className="text-sm mt-1">Los profesionales pueden indicar:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Precio mínimo por sesión</li>
                    <li>Precio máximo por sesión</li>
                    <li>Si ofrecen servicios voluntarios o de apoyo gratuito</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información de experiencia dentro de la plataforma</h3>
                  <p className="text-sm mt-1">PurpleMatch también puede registrar información relacionada con el uso de la plataforma, como:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Calificación promedio recibida por parte de las usuarias</li>
                    <li>Número total de valoraciones</li>
                    <li>Número de sesiones realizadas a través de la plataforma</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Información administrativa del sistema</h3>
                  <p className="text-sm mt-1">Para el funcionamiento interno de la plataforma también se almacenan:</p>
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li>Fecha de creación del perfil profesional</li>
                    <li>Estado de verificación dentro del sistema</li>
                    <li>Fecha de verificación por parte del equipo de PurpleMatch</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">2. Uso de la Información</h2>
              <p className="pl-4">Utilizamos la información para:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Crear y administrar cuentas</li>
                <li>Mejorar la experiencia de la plataforma</li>
                <li>Facilitar el match con profesionales</li>
                <li>Ofrecer recomendaciones personalizadas</li>
                <li>Mejorar la seguridad del sistema</li>
                <li>Enviar notificaciones importantes</li>
              </ul>
              <p className="pl-4 mt-2 font-medium text-purple-700">
                Nunca vendemos la información personal de las usuarias.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">3. Anonimato y Privacidad</h2>
              <p className="pl-4">PurpleMatch permite participación anónima opcional en la comunidad.</p>
              <p className="pl-4 mt-2">Cuando se activa:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>El nombre visible se reemplaza por un seudónimo</li>
                <li>Otros usuarios no pueden ver la identidad real</li>
              </ul>
              <p className="pl-4 mt-2">Sin embargo, la plataforma mantiene registros internos para seguridad y moderación.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">4. Compartición de Datos</h2>
              <p className="pl-4">PurpleMatch no comparte datos personales con terceros, excepto cuando sea necesario para:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Operar la plataforma</li>
                <li>Cumplir obligaciones legales</li>
                <li>Prevenir fraudes o riesgos de seguridad</li>
              </ul>
              <p className="pl-4 mt-2">Los profesionales de salud mental solo tienen acceso a la información necesaria para la atención terapéutica.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">5. Seguridad de la Información</h2>
              <p className="pl-4">PurpleMatch implementa medidas técnicas y organizativas para proteger la información, incluyendo:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Cifrado de contraseñas</li>
                <li>Almacenamiento seguro</li>
                <li>Acceso restringido a datos sensibles</li>
                <li>Monitoreo de seguridad</li>
              </ul>
              <p className="pl-4 mt-2 text-gray-600">A pesar de estas medidas, ningún sistema digital es completamente invulnerable.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">6. Retención de Datos</h2>
              <p className="pl-4">La información se conserva únicamente durante el tiempo necesario para:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Ofrecer los servicios de la plataforma</li>
                <li>Cumplir obligaciones legales</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
              <p className="pl-4 mt-2">Las usuarias pueden solicitar la eliminación de sus datos.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">7. Derechos de las Usuarias</h2>
              <p className="pl-4">Las usuarias pueden:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Acceder a sus datos</li>
                <li>Corregir información incorrecta</li>
                <li>Solicitar eliminación de su cuenta</li>
                <li>Configurar sus preferencias de privacidad</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">8. Cookies y Tecnologías Similares</h2>
              <p className="pl-4">PurpleMatch puede usar cookies para:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Mantener sesiones activas</li>
                <li>Mejorar rendimiento</li>
                <li>Analizar uso de la plataforma</li>
              </ul>
              <p className="pl-4 mt-2">Las usuarias pueden gestionar estas preferencias desde su navegador.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">9. Cambios en la Política de Privacidad</h2>
              <p className="pl-4">PurpleMatch puede actualizar esta política cuando sea necesario.</p>
              <p className="pl-4 mt-2">Los cambios se comunicarán dentro de la plataforma y se indicará la fecha de actualización.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">10. Contacto</h2>
              <p className="pl-4">Para preguntas sobre privacidad o manejo de datos:</p>
              <p className="pl-4 mt-2 font-medium">Correo: <span className="text-purple-700">privacy@purplematch.com</span></p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                Al utilizar PurpleMatch, confirmas que has leído y entendido esta Política de Privacidad.
              </p>
              <p className="text-center text-gray-500 text-sm mt-2">
                <Link to="/terms" className="text-purple-600 hover:underline font-medium">Ver Términos y Condiciones</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
