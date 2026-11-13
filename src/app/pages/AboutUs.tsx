import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const hoyImages = [
  { src: "img/historia/hoy1.jpeg", alt: "Ema Rizos hoy - salón" },
  { src: "img/historia/hoy2.jpeg", alt: "Ema Rizos hoy - clientes" },
];

export function AboutUs() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/40 mt-4 hover:bg-white transition-colors"></div>
    ),
  };

  return (
    <div className="py-8 md:py-16 bg-background min-h-[calc(100vh-140px)]">
      <div className="container mx-auto px-4">

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-bold text-primary mb-4 md:mb-6">Quiénes Somos</h1>
          <p className="text-xl md:text-3xl text-primary/80 font-script mt-2">
            "Con cientos de miedos pero con un sueño claro..."
          </p>
        </div>

        {/* The Story - Part 1 */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center mb-12 md:mb-24 max-w-6xl mx-auto">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6">El inicio de este sueño</h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-foreground/80 leading-relaxed">
              <p>
                Durante la pandemia, como a muchas, me tocó refugiarme en casa y replantearme hábitos que llevaba años repitiendo sin cuestionar. Uno de ellos fue alisar mi cabello. Al no estar expuestas a miradas ni juicios, muchas empezamos a dejarlo al natural. En ese proceso, mi cabello comenzó a crecer y por primera vez entendí que era rizado.
              </p>
              <p>
                Siempre he sido impaciente, así que tomé una decisión radical: me corté todo el cabello. Me quedé con apenas tres centímetros de crecimiento y empecé desde cero. Después de más de veinte años llevándolo liso, verme así fue extraño. No solo estaba cambiando mi imagen, estaba enfrentándome a una versión de mí que no conocía. Con el tiempo, ese proceso se convirtió en una forma de aceptación y de reconocimiento personal.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 w-full max-w-sm mx-auto lg:max-w-none">
            <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl border-4 md:border-8 border-white">
              <img
                src="img/historia/historia1.png"
                alt="El inicio del gran cambio capilar"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* The Story - Part 2 */}
        <div className="flex flex-col lg:flex-row-reverse gap-8 md:gap-12 items-center mb-12 md:mb-24 max-w-6xl mx-auto">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6">Un propósito compartido</h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-foreground/80 leading-relaxed">
              <p>
                A medida que aprendía a cuidar mi propio cabello, comenzaron a llegar preguntas, conversaciones y otras historias muy parecidas a la mía. Ahí entendí que no era la única pasando por ese proceso. Fue en ese intercambio donde nació un propósito claro: crear un espacio para acompañar a otras mujeres a sentirse comprendidas, seguras y tranquilas usando su cabello al natural.
              </p>
              <p className="font-semibold text-primary text-base md:text-xl">
                Así nació Ema Rizos, en un rincón de mi casa, con una silla y un espejo, con cientos de miedos pero con un sueño claro.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex gap-3 md:gap-4 max-w-sm mx-auto lg:max-w-none">
            <div className="w-1/2 mt-8 md:mt-12 aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl border-4 md:border-8 border-white">
              <img
                src="img/historia/historia2.png"
                alt="Una silla y un espejo donde todo comenzó"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-1/2 aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl border-4 md:border-8 border-white">
              <img
                src="img/historia/historia3.png"
                alt="Mujeres compartiendo y apoyándose"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Ema Rizos Hoy - Highlight Banner */}
        <div className="bg-primary text-primary-foreground px-4 md:px-16 py-10 md:py-16 mb-12 md:mb-20 shadow-xl relative overflow-hidden -mx-4">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-xl md:text-4xl font-bold text-white mb-4 md:mb-6">Ema Rizos Hoy</h2>

            <div className="space-y-3 md:space-y-4 text-sm md:text-lg text-primary-foreground/90 leading-relaxed font-light mb-6 md:mb-8">
              <p>
                Hoy, después de <strong>cinco años de trabajo</strong>, Ema Rizos se ha consolidado como un referente del cabello ondulado, rizado y afro en Barranquilla.
              </p>
              <p>
                Hemos acompañado a <strong>más de 2.000 personas</strong> —niñas, jóvenes, mujeres, madres y hombres— en el reconocimiento y cuidado de su cabello natural, aportando desde la experiencia, el respeto y la identidad.
              </p>
              <div className="pt-2 md:pt-4">
                <p className="font-semibold text-white text-base md:text-2xl italic">
                  "Ese recorrido es el que hoy nos permite seguir formando, acompañando y compartiendo conocimiento con propósito."
                </p>
              </div>
            </div>

            {/* Carrusel de imágenes */}
            <div className="rounded-2xl overflow-hidden">
              <Slider {...sliderSettings}>
                {hoyImages.map((img) => (
                  <div key={img.src}>
                    <div className="aspect-video rounded-2xl overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}