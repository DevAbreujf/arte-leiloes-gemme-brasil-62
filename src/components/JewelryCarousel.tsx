import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface JewelryImage {
  src: string;
  alt: string;
  title?: string;
}

const JewelryCarousel: React.FC = () => {
  // Lista de imagens das joias raras
  const jewelryImages: JewelryImage[] = [
    { src: "/images/home/1.jpg", alt: "Joia Rara 1", title: "Coleção Exclusiva" },
    { src: "/images/home/2.jpg", alt: "Joia Rara 2", title: "Diamante Excepcional" },
    { src: "/images/home/4.jpg", alt: "Joia Rara 4", title: "Peça Histórica" },
    { src: "/images/home/5.jpg", alt: "Joia Rara 5", title: "Esmeralda Colombiana" },
    { src: "/images/home/6.jpg", alt: "Joia Rara 6", title: "Colar de Pérolas" },
    { src: "/images/home/7.jpg", alt: "Joia Rara 7", title: "Anel Art Déco" },
    { src: "/images/home/9.jpg", alt: "Joia Rara 9", title: "Broche Vintage" },
    { src: "/images/home/10.jpg", alt: "Joia Rara 10", title: "Relógio Patek Philippe" },
    { src: "/images/home/14.jpg", alt: "Joia Rara 14", title: "Tiara Real" },
    { src: "/images/home/15.jpg", alt: "Joia Rara 15", title: "Brincos de Diamante" },
    { src: "/images/home/17.jpg", alt: "Joia Rara 17", title: "Pulseira de Safiras" },
    { src: "/images/home/18.jpg", alt: "Joia Rara 18", title: "Conjunto Completo" },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {jewelryImages.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="relative group overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-lagemme-dark" />
        <CarouselNext className="right-4 bg-white/80 hover:bg-white text-lagemme-dark" />
      </Carousel>
    </div>
  );
};

export default JewelryCarousel;
