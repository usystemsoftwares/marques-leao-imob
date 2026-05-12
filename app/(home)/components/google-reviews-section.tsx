import Link from "next/link";
import Image from "next/image";
import Stars from "/public/marqueseleao/stars.svg";

const PLACE_ID = "ChIJo9vcbfhDGZURENPLvy7sxUo";
const MAPS_URL =
  "https://www.google.com/maps/place/Imobili%C3%A1ria+Marques+%26+Le%C3%A3o/@-29.6840739,-51.1236798,17z/data=!3m1!4b1!4m6!3m5!1s0x951943f86ddcdba3:0x4ac5ec2ebfcbd310";

async function getReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.reviews",
      },
      body: JSON.stringify({
        textQuery: "Imobiliária Marques & Leão Novo Hamburgo RS",
        languageCode: "pt-BR",
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.places?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function GoogleReviewsSection() {
  const place = await getReviews();
  if (!place?.reviews?.length) return null;

  return (
    <section className="lg:w-[min(90%,65.5rem)] mt-12 mb-8 mx-auto px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Google "G" logo SVG inline */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span className="text-[#898989] text-sm">Avaliações no Google</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold">{place.rating?.toFixed(1)}</span>
            <div className="flex flex-col">
              <Image src={Stars} alt="5 estrelas" style={{ maxWidth: "100%", height: "auto" }} />
              <span className="text-[#898989] text-sm mt-1">{place.userRatingCount} avaliações</span>
            </div>
          </div>
        </div>
        <Link
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#898989] hover:text-white transition-colors underline underline-offset-4 whitespace-nowrap"
        >
          Ver todas no Google →
        </Link>
      </div>

      {/* Reviews grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {place.reviews.map((review: any, i: number) => (
          <li
            key={i}
            className="rounded-[1.25rem] bg-white px-5 pt-5 pb-4 text-black flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.authorAttribution.photoUri}
                alt={review.authorAttribution.displayName}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">
                  {review.authorAttribution.displayName}
                </p>
                <p className="text-[#707070] text-xs">{review.relativePublishTimeDescription}</p>
              </div>
            </div>
            <Image src={Stars} alt={`${review.rating} estrelas`} style={{ maxWidth: "80px", height: "auto" }} />
            <p className="text-sm text-[#333] leading-5 line-clamp-5">{review.text.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
