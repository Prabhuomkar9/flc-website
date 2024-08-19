import Image from "next/image";

import BlurFade from "~/components/magicui/blur-fade";
import BoxReveal from "~/components/magicui/box-reveal";
import { ConfettiButton } from "~/components/magicui/confetti";

const images: {
  src: string;
  title: string;
}[] = [
  // { src: "img5.jpeg", title: "FareWell 2024" },
  // { src: "img6.jpeg", title: "FareWell 2024" },
  // { src: "img7.jpeg", title: "FareWell 2024" },
  // { src: "img9.jpeg", title: "FareWell 2024" },
  // { src: "img8.jpeg", title: "Image 8" },
  // { src: "img10.jpeg", title: "Image 10" },
];

export function BlurFadeDemo() {
  return (
    <section
      id="photos"
      className="bg-gradient-to-b from-[#e0d4961a] via-[#f5efc1] to-[#e0d4961a]  px-4 py-8"
    >
      <div className="p-4">
        <div className="mb-8 space-y-4 text-left">
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <h1 className="mb-2 rounded-r-full border border-yellow-400 p-4 text-3xl font-bold ">
              Image Gallery
            </h1>
          </BoxReveal>
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <p className="text-lg">
              Explore our collection of beautiful memories, randomly generated
              images. Each image showcases a unique blend of colors and shapes
              to inspire creativity and enhance your visual experience.
            </p>
          </BoxReveal>
          <hr />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-3">
          {images.map((image, idx) => (
            <BlurFade key={image.src} delay={0.25 + idx * 0.05} inView>
              <ConfettiButton
                options={{
                  get angle() {
                    return Math.random() * 360;
                  },
                }}
              >
                <div className="relative mb-4 overflow-hidden rounded-lg md:m-1">
                  <Image
                    src={`/${image.src}`}
                    layout="responsive"
                    width={100}
                    height={100}
                    alt={image.title}
                    className="h-auto w-full object-cover"
                    priority={idx < 2}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-1 text-white md:p-8">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                      <div className="text-left text-sm md:text-xl lg:text-2xl">
                        {image.title}
                      </div>
                    </BoxReveal>
                  </div>
                </div>
              </ConfettiButton>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlurFadeDemo;
