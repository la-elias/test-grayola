import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import Feature from '@/components/landing/feature'
import { ArrowUpDown, Timer, Workflow } from 'lucide-react'
import Link from 'next/link'
import { Cuervi, Cuervi2 } from '@/components/ui/icons'
import { Header } from '@/components/landing/header'

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col`}
    >
      <Header />
      <div className="flex flex-1 justify-center w-full">
        <div className="flex w-full max-w-[1280px] h-full">
          <div
            className="flex flex-col h-full md:py-36 md:px-32 pt-11 pb-24 px-8
              w-full items-center text-center gap-12"
          >
            <div className="flex flex-col gap-6 items-center">
              <Typography
                className="max-w-2xl"
                variant="h1"
              >
                Una suscripción para todos tus proyectos de
                diseño
              </Typography>
              <Typography
                className="max-w-2xl"
                variant="h5"
              >
                Escala y delega todas las operaciones de
                diseño de tu organización con un servicio de
                diseño confiable y sin complicaciones.
              </Typography>
              <Link href="#">
                <Button size="tiny" variant="default">
                  <Typography
                    variant="p"
                    className="text-white dark:text-black"
                  >
                    Empieza Ahora!
                  </Typography>
                </Button>
              </Link>
              <Cuervi2 />
            </div>
            <div className="flex flex-col md:pt-24 md:gap-36 gap-24 items-center">
              <div className="flex flex-col gap-12 items-center">
                <Typography
                  className="max-w-2xl"
                  variant="h1"
                >
                  Soluciones rápidas, adiós problemas
                </Typography>
                <div className="flex md:flex-row flex-col gap-12">
                  <Feature
                    icon={<Timer size={24} />}
                    headline="Crea un pedido"
                    description="Completa un breve formulario con todos los detalles que tengas en mente para tu diseño. ¡No te tomará más de 2 minutos!"
                  />
                  <Feature
                    icon={<ArrowUpDown size={24} />}
                    headline="Lo asignamos a nuestro equipo"
                    description="Nuestro equipo seleccionará al mejor grupo de especialistas para tu proyecto, con un director creativo y diseñadores dedicados."
                  />
                  <Feature
                    icon={<Workflow size={24} />}
                    headline="Entregamos tus diseños"
                    description="Recibe las primeras iteraciones de tus pedidos en tiempo récord, en un plazo aproximado de 24 a 72 horas dependiendo de la complejidad de cada pedido."
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 max-w-2xl items-center">
                <Typography
                  className="max-w-2xl"
                  variant="h1"
                >
                  Todos los servicios creativos que
                  necesitas en un solo lugar.
                </Typography>
                <Typography
                  className="max-w-2xl"
                  variant="p"
                >
                  Explora más de 100 servicios de diseño
                  disponibles con nuestra suscripción
                </Typography>
                <Cuervi />
              </div>
              <div className="flex flex-col gap-6 items-center">
                <Typography
                  className="max-w-2xl"
                  variant="h1"
                >
                  Comienza gratis hoy mismo
                </Typography>
                <div>
                  Conoce al instante a tu próximo equipo
                  creativo y diseñemos hoy mismo tu primer
                  pedido en Grayola, 100% gratis.
                </div>
                <Link href="#">
                  <Button size="tiny" variant="default">
                    <Typography
                      variant="p"
                      className="text-white dark:text-black"
                    >
                      Agenda prueba gratis
                    </Typography>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
