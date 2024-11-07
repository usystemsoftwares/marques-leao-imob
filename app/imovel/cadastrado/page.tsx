import RealEstatePage from "../[id]/page";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <RealEstatePage params={params} searchParams={searchParams} />;
}
