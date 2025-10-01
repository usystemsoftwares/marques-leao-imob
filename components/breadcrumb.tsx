"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { generateBreadcrumbStructuredData } from "@/utils/seo-utils";
import { useEffect } from "react";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Adicionar structured data ao head
  useEffect(() => {
    if (typeof window !== "undefined" && items.length > 0) {
      const structuredDataItems = items.map((item, index) => ({
        name: item.name,
        url: item.url || `${window.location.origin}${window.location.pathname}`
      }));
      
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(generateBreadcrumbStructuredData(structuredDataItems));
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [items]);
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}
    >
      <Link 
        href="/" 
        className="hover:text-white transition-colors"
      >
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {item.url ? (
            <Link 
              href={item.url} 
              className="hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  );
}