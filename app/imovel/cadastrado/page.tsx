import RealEstatePage from "../[...path]/page";

export default async function Page({
  params,
  searchParams,
}: {
  params: { path: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("params", params);
  console.log("searchParams", searchParams);
  return <RealEstatePage params={params || {}} searchParams={searchParams || {}} />;
}
