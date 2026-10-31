
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
    <section className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-6 sm:py-14">

      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Follow us on Instagram
        </h2>

        <p className="mt-1 text-xs opacity-70">
          Explore our latest cinematic jewelry showcases and artisan crafting clips.
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {videoList.map((video) => {
          const embedUrl = getInstagramEmbedUrl(video.instagramUrl);

          return (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 hover:-translate-y-1"
              
            >

              {/* Instagram Embed */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">

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
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
                    <Film size={36} />
                    <p className="text-sm">Instagram post unavailable</p>
                  </div>
                )}

              </div>

              {/* Video Details */}
              <div className="p-4 flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold truncate">
                    {video.title}
                  </h3>

                  <p className="mt-0.5 text-[10px] opacity-70">
                    ❤️ {video.likes} engagements
                  </p>
                </div>

                <a
                  href={video.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${video.title} on Instagram`}
                  className="shrink-0 rounded-xl p-2.5 transition opacity-70 hover:opacity-100"
                  style={{
                    backgroundColor: currentTheme.surface
                  }}
                >
                  <ExternalLink
                    size={16}
                    style={{ color: currentTheme.accent }}
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
