import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.song.createMany({
    data: [
      {
    id: "13e8d1d1-bc6e-4447-911d-9adb00981888",
    title: "Switzerland",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  },
  {
    id: "1e55b82d-2e96-4c99-bc8b-d2c7c86f002a",
    title: "Finland",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  },
  {
    id: "6b39fcfa-63f1-44e9-933d-9b6f9ded71bf",
    title: "Iceland",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  },
    {
    id: "4bb8b84d-94c0-4ee6-86e8-ad43d3fede7c",
    title: "Australia",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  },
    {
    id: "67e470ba-3132-4e55-9ee6-269219232683",
    title: "Neatherlands",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  },
    {
    id: "7facc4eb-40fd-401e-9006-04b945b89b6a",
    title: "Ireland",
    duration: 428.772979,
    song_url: "/audio/nature.mp3"
  }
    ],
  });

  console.log("Seeded user!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
