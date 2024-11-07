import ListingStayPage from "./[...filters]/page";

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: { filters: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ListingStayPage params={params} searchParams={searchParams} />;
}
