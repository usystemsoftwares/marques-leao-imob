import ListingStayPage from "./[...filters]/page";

export default async function ListingPage({
  params,
  searchParams,
}: {
  params?: { filters?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Quando não há filtros na URL, passar um params vazio
  const pageParams = {
    filters: params?.filters || []
  };
  
  return <ListingStayPage params={pageParams} searchParams={searchParams || {}} />;
}
