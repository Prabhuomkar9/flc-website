"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { type StaticImageData } from "next/image";
import { useRef } from "react";

import { Button } from "../ui/button";

interface Project {
  id: number;
  title: string;
  src: StaticImageData;
}

const ProjectCard: React.FC<{ title: string; src: StaticImageData }> = ({
  title,
  src,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "power1.inOut",
        },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: cardRef.current,
            toggleActions: "restart none none reverse",
            start: "top 80%",
            end: "bottom 20%",
          },
        },
      );
    },
    { scope: cardRef },
  );

  return (
    <div
      className="hoverable relative h-80 w-full overflow-hidden rounded"
      ref={cardRef}
    >
      <Image
        src={src}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 rounded-xl"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black to-transparent p-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
};

function Projects() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          scale: 0.5,
          duration: 3,
          ease: "power1.inOut",
        },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: ref.current,
            toggleActions: "restart none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  const projects: Project[] = [
    // { id: 1, title: "Dice Of Destiny", src: dod },
    // { id: 2, title: "Odyssey Of A Lifttime", src: dol },
    // { id: 3, title: "Tides Of Chnage", src: waves },
    // { id: 4, title: "HackFest", src: Hackfest },
    // { id: 5, title: "Yakshagavishti", src: yaksha },
    // { id: 5, title: "Flc Website", src: yaksha },
  ];

  return (
    <section className="bg-gradient mt-12 flex min-h-[80vh] flex-col items-center gap-4 p-2 md:p-10">
      <h3 className="subheading text-center " ref={ref}>
        “ Projects ❞
      </h3>
      <p className="text-center">
        Get the opportunity to work on numerous real-world projects
      </p>
      <div className="grid h-full w-full flex-grow grid-cols-1 place-items-center items-center justify-between gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            src={project.src}
          />
        ))}
      </div>
      <Button className="hoverable mx-auto">View All Past Projects</Button>
    </section>
  );
}

export default Projects;
