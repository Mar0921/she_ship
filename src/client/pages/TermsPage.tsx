import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import Page from '@/client/components/Page';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <Page>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-700">TÉRMINOS Y CONDICIONES DE USO</CardTitle>
            <p className="text-center text-gray-500 mt-2">PURPLEMATCH</p>
            <p className="text-center text-sm text-gray-400">Última actualización: 2026</p>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium">
                Bienvenida a PurpleMatch, una plataforma digital diseñada para brindar acompañamiento emocional y psicológico a mujeres. Al acceder o utilizar la plataforma, aceptas cumplir los siguientes Términos y Condiciones. Si no estás de acuerdo con estos términos, te recomendamos no utilizar el servicio.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">1. Naturaleza del Servicio</h2>
              <p className="pl-4">
                PurpleMatch es una plataforma tecnológica de apoyo emocional, cuyo objetivo es facilitar el acceso a:
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Profesionales de salud mental verificados</li>
                <li>Comunidades de apoyo moderadas</li>
                <li>Recursos educativos sobre bienestar emocional</li>
                <li>Herramientas personales como diario emocional y seguimiento terapéutico</li>
              </ul>
              <p className="pl-4 mt-2">
                La plataforma busca ofrecer un espacio seguro, respetuoso y confidencial para las usuarias.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">2. Elegibilidad y Registro</h2>
              <p className="pl-4">
                Para utilizar PurpleMatch debes:
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Tener al menos 18 años de edad</li>
                <li>Proporcionar información veraz y actualizada durante el registro</li>
                <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                <li>No compartir tu cuenta con terceros</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">3. Uso Responsable de la Plataforma</h2>
              <p className="pl-4">
                Al usar PurpleMatch, te comprometes a:
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Mantener una conducta respetuosa hacia otras usuarias y profesionales</li>
                <li>No publicar contenido violento, discriminatorio, acosador o inadecuado</li>
                <li>No utilizar la plataforma para fines comerciales no autorizados</li>
                <li>Respetar la privacidad y confidencialidad de otras usuarias</li>
                <li>No realizar actividades fraudulentas o ilegales</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">4. Profesionales de Salud Mental</h2>
              <p className="pl-4">
                PurpleMatch verifica la formación y habilitación profesional de los terapeutas enlistados en la plataforma. Sin embargo:
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>La plataforma funciona como un puente entre usuarias y profesionales</li>
                <li>PurpleMatch no es un servicio de emergencia médica ni sustituye la atención profesional presencial</li>
                <li>Las decisiones sobre tu tratamiento siempre deben tomarse junto con un profesional calificado</li>
                <li>Si estás en crisis, te recomendamos contactar servicios de emergencia locales</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">5. Privacidad y Confidencialidad</h2>
              <p className="pl-4">
                PurpleMatch se compromete a proteger tu información personal y emocional. Toda la información que compartas en la plataforma está sujeta a nuestra Política de Privacidad, que puedes consultar en <Link to="/privacy" className="text-purple-600 hover:underline font-medium">Política de Privacidad</Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">6. Propiedad Intelectual</h2>
              <p className="pl-4">
                Todo el contenido disponible en PurpleMatch, incluyendo diseños, textos, gráficos, logos e iconos, son propiedad de PurpleMatch o de sus respectivos propietarios y están protegidos por leyes de propiedad intelectual.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">7. Limitación de Responsabilidad</h2>
              <p className="pl-4">
                PurpleMatch proporciona una plataforma de acompañamiento emocional pero no garantiza resultados específicos en el bienestar de las usuarias. La plataforma no se hace responsable de:
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Las decisiones o acciones tomadas por las usuarias basadas en el contenido de la plataforma</li>
                <li>La calidad de los servicios proporcionados por profesionales externos</li>
                <li>Interrupciones técnicas que puedan afectar el acceso a la plataforma</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">8. Modificaciones al Servicio</h2>
              <p className="pl-4">
                PurpleMatch se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto de la plataforma en cualquier momento. Cualquier cambio será comunicado a las usuarias a través de la plataforma.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">9. Terminación de Cuenta</h2>
              <p className="pl-4">
                PurpleMatch puede suspender o eliminar tu cuenta si incumples estos Términos y Condiciones, o si detectamos actividad sospechosa o ilegal. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">10. Ley Aplicable</h2>
              <p className="pl-4">
                Estos Términos y Condiciones se rigen por las leyes vigentes. Cualquier disputa será resuelta en los tribunales correspondientes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-700">11. Contacto</h2>
              <p className="pl-4">
                Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en: <span className="font-medium">privacy@purplematch.com</span>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                Al utilizar PurpleMatch, confirmas que has leído, entendido y aceptado estos Términos y Condiciones.
              </p>
              <p className="text-center text-gray-500 text-sm mt-2">
                <Link to="/privacy" className="text-purple-600 hover:underline font-medium">Ver Política de Privacidad</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
