import { ExternalLink, Film } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function InstagramVideos({ videos = [] }) {
  const { currentTheme } = useTheme();

  // Instagram video links
  const videoList = videos.length > 0 ? videos : [
    {
      id: "1",
      title: "Handcrafted Necklace",
      instagramUrl: "https://www.instagram.com/reel/DfHaHDmBMTm/",
      likes: "1.4k",
    },
    {
      id: "2",
      title: "Handcrafted Antique Combo Set",
      instagramUrl: "https://www.instagram.com/p/DeJaeuNhY-1/",
      likes: "850",
    },
    {
      id: "3",
      title: "Exclusive Combo set",
      instagramUrl: "https://www.instagram.com/p/DEFdhkHNYDf/",
      likes: "2.1k",
    }
  ];

  // Generate Instagram embed URL
  const getInstagramEmbedUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      const parts = parsedUrl.pathname.split("/").filter(Boolean);

      const type = parts[0];
      const shortcode = parts[1];

      if (!["p", "reel", "tv"].includes(type) || !shortcode) {
        return null;
      }

      return `https://www.instagram.com/${type}/${shortcode}/embed`;
    } catch {
      return null;
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-6 sm:py-14">

      {/* Section Header */}
      <div className="mb-6 sm:mb-10 text-center px-2">
         <h2 className="text-3xl font-serif text-[#d4af37] tracking-widest mb-1 font-bold">
          Follow us on Instagram
        </h2>

        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-black">
          Explore our latest cinematic jewelry showcases and artisan crafting clips.
        </p>
      </div>

      {/* Responsive Grid / Touch Carousel on Mobile */}
      <div className="flex sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none">

        {videoList.map((video) => {
          const embedUrl = getInstagramEmbedUrl(video.instagramUrl);

          return (
            <div
              key={video.id}
              className="group shrink-0 w-[85vw] max-w-[340px] sm:w-auto snap-center overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              
            >

              {/* Instagram Embed Container (Height optimized for 9:16 mobile / 4:5 desktop) */}
              <div className="relative w-full aspect-[9/16] min-h-[420px] sm:min-h-0 sm:aspect-[4/5] overflow-hidden bg-black/90">

                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-white p-4">
                    <Film size={36} />
                    <p className="text-xs sm:text-sm text-center">Instagram post unavailable</p>
                  </div>
                )}

              </div>

              {/* Video Details */}
              <div 
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-t mt-auto"
                
              >

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold truncate">
                    {video.title}
                  </h3>

                  <p className="mt-0.5 text-[10px] sm:text-xs opacity-70 flex items-center gap-1">
                    <span>❤️</span> {video.likes} engagements
                  </p>
                </div>

                <a
                  href={video.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${video.title} on Instagram`}
                  className="shrink-0 rounded-xl p-2 sm:p-2.5 transition opacity-80 hover:opacity-100 active:scale-95"
                 
                >
                  <ExternalLink
                    size={16}
                    
                  />
                </a>

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}