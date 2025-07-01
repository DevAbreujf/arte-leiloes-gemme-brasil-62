
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Componente LanguageSelector
 * Seletor de idioma com bandeiras - versão desktop
 */
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleValueChange = (value: string) => {
    setLanguage(value as 'pt' | 'en');
    setIsOpen(false);
  };

  // Hide on mobile - mobile version will be handled separately
  if (isMobile) {
    return null;
  }

  return (
    <Select 
      value={language} 
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-40 bg-white border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-gray-500">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <img 
              src={language === 'pt' 
                ? "/images/flags/brazil.png" 
                : "/images/flags/usa.png"
              }
              alt={language === 'pt' ? "Bandeira do Brasil" : "Bandeira dos EUA"}
              className="w-4 h-3 rounded-sm object-cover"
            />
            <span className="text-sm text-gray-600">
              {language === 'pt' ? 'Português' : 'English'}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="bg-white border border-gray-300 shadow-lg rounded-md z-[9999] min-w-[160px]" 
        position="popper"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
      >
        <SelectItem value="pt" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/flags/brazil.png" 
              alt="Bandeira do Brasil" 
              className="w-4 h-3 rounded-sm object-cover"
            />
            <span>Português</span>
          </div>
        </SelectItem>
        <SelectItem value="en" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/flags/usa.png" 
              alt="Bandeira dos EUA" 
              className="w-4 h-3 rounded-sm object-cover"
            />
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
