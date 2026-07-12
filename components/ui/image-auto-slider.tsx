import React from 'react';

export const ImageAutoSlider = () => {
  // Images for the infinite scroll
  const images = [
    "https://i.postimg.cc/x8h1QdJp/bao-zhuang-he.png",
    "https://i.postimg.cc/VvpkwNr7/bao-zhuang-dai.png",
    "https://i.postimg.cc/wMZjzBRg/zhou-bian.png",
    "https://i.postimg.cc/1X23SznY/fan-bu-dai.png",
    "https://i.postimg.cc/x8h1QdJw/shou-na-dai.png",
    "https://i.postimg.cc/GtVmRpTn/shui-bei.png",
    "https://i.postimg.cc/j2mSTjwF/bi-ji-ben.png",
    "https://i.postimg.cc/8c9zGCJ9/jing-zi.png"
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }

        .image-item {
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .image-item:hover {
          transform: scale(1.06) translateY(-4px);
          filter: brightness(1.05);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15);
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden flex items-center justify-center py-8">
        {/* Left and Right ambient smooth edge fades (Standard cross-browser gradients) */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />

        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="w-full max-w-7xl overflow-hidden">
            <div className="infinite-scroll flex gap-8 w-max px-8">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-44 aspect-[3/4] md:w-72 rounded-3xl overflow-hidden shadow-md border border-stone-200/30 bg-white"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Component = ImageAutoSlider;
