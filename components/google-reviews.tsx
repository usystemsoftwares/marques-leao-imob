import Link from "next/link";

interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface PlaceDetails {
  result: {
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
    url: string;
  };
  status: string;
}

async function getGoogleReviews(): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,url&language=pt-BR&key=${apiKey}`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function GoogleReviews() {
  const data = await getGoogleReviews();
  if (!data || data.status !== "OK" || !data.result?.reviews?.length) return null;

  const { reviews, rating, user_ratings_total, url } = data.result;
  const display = reviews.filter((r) => r.rating === 5).length >= 3
    ? reviews.filter((r) => r.rating === 5)
    : reviews;

  return (
    <section className="w-full py-12 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-5">
            <svg viewBox="0 0 24 24" className="w-9 h-9 shrink-0" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <p className="font-bold text-white text-lg leading-tight">Imobiliária Marques&Leão</p>
              <p className="text-xs text-gray-400 mb-1">Avaliações no Google</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
                <Stars rating={Math.round(rating)} />
                <span className="text-sm text-gray-400">({user_ratings_total})</span>
              </div>
            </div>
          </div>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm border border-white/20 hover:border-white px-4 py-2 rounded-lg transition-colors text-gray-300 hover:text-white shrink-0"
          >
            Ver todas no Google →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {display.slice(0, 5).map((review, i) => (
            <div
              key={i}
              className="min-w-[15rem] max-w-[18rem] shrink-0 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{review.author_name}</p>
                  <p className="text-xs text-gray-400">{review.relative_time_description}</p>
                </div>
              </div>
              <Stars rating={review.rating} />
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
                {review.text || "Ótimo atendimento!"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
