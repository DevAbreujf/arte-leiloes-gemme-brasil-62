import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, title }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lista de todas as imagens na pasta home
  const allImages = [
    "/images/home/1.jpg", "/images/home/2.jpg", "/images/home/3.jpg", "/images/home/4.jpg", 
    "/images/home/5.jpg", "/images/home/6.jpg", "/images/home/7.jpg", "/images/home/8.jpg",
    "/images/home/9.jpg", "/images/home/10.jpg", "/images/home/12.jpg", "/images/home/14.jpg", 
    "/images/home/15.jpg", "/images/home/17.jpg", "/images/home/18.jpg", "/images/home/19.jpg",
    "/images/home/22.jpg", "/images/home/23.jpg", "/images/home/24.jpg", "/images/home/25.jpg", 
    "/images/home/26.jpg", "/images/home/27.jpg", "/images/home/28.jpg", "/images/home/29.jpg",
    "/images/home/32.jpg", "/images/home/33.jpg", "/images/home/35.jpg", "/images/home/36.jpg",
    "/images/home/37.jpg", "/images/home/38.jpg", "/images/home/39.jpg", "/images/home/40.jpg", 
    "/images/home/41.jpg", "/images/home/43.jpg", "/images/home/45.jpg", "/images/home/46.jpg",
    "/images/home/47.jpg", "/images/home/48.jpg", "/images/home/49.jpg", "/images/home/50.jpg", 
    "/images/home/51.jpg", "/images/home/52.jpg", "/images/home/53.jpg",
    "/images/home/1184leilao25.jpg", "/images/home/1226leilao25.jpg"
  ];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-light text-lagemme-dark">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {!selectedImage ? (
            // Grid de miniaturas
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Peça ${index + 1}`}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          ) : (
            // Imagem expandida
            <div className="relative">
              <button
                onClick={handleCloseImage}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-lagemme-dark p-2 rounded-full shadow-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Imagem expandida"
                className="w-full h-auto max-h-[calc(90vh-150px)] object-contain mx-auto"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
