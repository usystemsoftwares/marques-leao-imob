"use client";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

interface PaginationProps {
  className?: string;
  pages: number;
  page: number;
  pathname: string;
  query: any;
  filters: any[];
}

const Pagination: FC<PaginationProps> = ({
  className = "",
  pages,
  page,
  pathname,
  query,
  filters,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(false);
    setLoadingPage(null);
  }, [page]);

  const generatePageNumbers = () => {
    const numbers: number[] = [];
    const windowSize = 5;

    // Sempre adiciona a primeira página
    numbers.push(1);

    // Adiciona um separador se necessário
    if (page > 4) {
      numbers.push(-1);
    }

    let start = Math.max(2, page - 2);
    let end = Math.min(start + windowSize - 1, pages);

    if (end - start < windowSize - 1) {
      start = Math.max(2, end - windowSize + 1);
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== pages) {
        numbers.push(i);
      }
    }

    // Adiciona um separador se necessário
    if (pages - page > 3) {
      numbers.push(-2);
    }

    // Adiciona a última página se for diferente da primeira
    if (pages > 1 && !numbers.includes(pages)) {
      numbers.push(pages);
    }

    return numbers;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageChange = debounce((pagina: number) => {
    setIsLoading(true);
    setLoadingPage(pagina);

    // Construir os segmentos de URL atualizados incluindo `pagina-xxx`
    const newFilters = [...(filters || [])];
    console.log("newFilters", newFilters, query);

    // Remover qualquer segmento existente de paginação
    const filteredFilters = newFilters.filter(
      (segment: string) => !segment.startsWith("pagina-")
    );

    // Adicionar o novo segmento de paginação
    filteredFilters.push(`pagina-${pagina}`);
    console.log("filteredFilters", filteredFilters);

    const newPath = `/imoveis/${filteredFilters.join("/")}`;

    router.push(newPath as any);
  }, 300);

  const renderItem = (pagina: number, index: number) => {
    const isSelected = pagina == page && !isLoading;
    const isPageLoading = pagina == loadingPage;

    const baseClass =
      "w-10 h-10 grid place-items-center rounded-lg cursor-pointer";
    const selectedClass = "bg-mainPurple";
    const normalClass = "border border-white";
    const loadingClass = "bg-mainPurple text-white";

    if (pagina < 0) {
      return (
        <div key={index} className={`${baseClass} ${normalClass}`}>
          {"..."}
        </div>
      );
    }

    const buttonClass = isPageLoading
      ? loadingClass
      : isSelected
      ? selectedClass
      : normalClass;

    return (
      <div
        key={index}
        className={`${baseClass} ${buttonClass}`}
        onClick={() => handlePageChange(pagina)}
        style={{ position: "relative" }}
      >
        {isPageLoading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          pagina
        )}
      </div>
    );
  };

  return pages === 0 ? (
    <div className={`${className} flex justify-center items-center`}>
      Nenhum imóvel encontrado
    </div>
  ) : (
    <div
      className={`flex justify-center mt-12 items-center gap-3 ${className}`}
    >
      {pageNumbers.map(renderItem)}
    </div>
  );
};

export default Pagination;
