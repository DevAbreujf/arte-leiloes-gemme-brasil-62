import React from 'react';
import { Card } from '@/components/ui/card';

interface JewelryItem {
  src: string;
  title: string;
  category: string;
  featured?: boolean;
}

const FeaturedJewelryGrid: React.FC = () => {
  const jewelryItems: JewelryItem[] = [
    { src: "/images/home/32.jpg", title: "Anel de Diamante Rosa", category: "Anéis", featured: true },
    { src: "/images/home/38.jpg", title: "Colar de Esmeraldas", category: "Colares" },
    { src: "/images/home/39.jpg", title: "Bracelete Art Nouveau", category: "Braceletes" },
    { src: "/images/home/40.jpg", title: "Brincos de Pérolas Tahiti", category: "Brincos" },
    { src: "/images/home/41.jpg", title: "Relógio Vacheron Constantin", category: "Relógios", featured: true },
    { src: "/images/home/45.jpg", title: "Tiara de Diamantes", category: "Tiaras" },
    { src: "/images/home/46.jpg", title: "Anel de Safira Azul", category: "Anéis" },
    { src: "/images/home/49.jpg", title: "Conjunto de Rubis", category: "Conjuntos" },
    { src: "/images/home/50.jpg", title: "Relógio Audemars Piguet", category: "Relógios" },
    { src: "/images/home/52.jpg", title: "Broche Vintage", category: "Broches", featured: true },
    { src: "/images/home/53.jpg", title: "Colar de Diamantes", category: "Colares" },
    { src: "/images/home/1184leilao25.jpg", title: "Peça de Coleção Especial", category: "Especial" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {jewelryItems.map((item, index) => (
        <Card 
          key={index} 
          className={`group cursor-pointer overflow-hidden border-lagemme-light/20 hover:shadow-xl transition-all duration-300 ${
            item.featured ? 'md:col-span-2 md:row-span-2' : ''
          }`}
        >
          <div className="relative overflow-hidden">
            <img
              src={item.src}
              alt={item.title}
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                item.featured ? 'h-[500px]' : 'h-[300px]'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-sm font-light tracking-widest uppercase mb-2 block">
                  {item.category}
                </span>
                <h3 className="text-xl font-light">
                  {item.title}
                </h3>
              </div>
            </div>
            {item.featured && (
              <div className="absolute top-4 right-4 bg-lagemme-dark text-white px-3 py-1 text-sm font-light rounded">
                Destaque
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedJewelryGrid;
