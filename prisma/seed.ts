// seed.ts
import { PrismaClient } from '@prisma/client';
import * as mm from 'music-metadata'; // Import the library
import path from 'path'; // Node.js path module for handling file paths

const prisma = new PrismaClient();

/**
 * A helper function to get the duration of an audio file.
 * @param filePath - The relative path to the audio file from the project root.
 * @returns The duration of the audio in seconds.
 */
async function getAudioDuration(filePath: string): Promise<number> {
  try {
    // Construct the absolute path to the audio file
    // path.join combines path segments, __dirtitle is the directory of the current script
    const absolutePath = path.join(process.cwd(), filePath);

    // Parse the file and get its metadata
    const metadata = await mm.parseFile(absolutePath);

    // Return the duration, or 0 if it's not available
    return metadata.format.duration ?? 0;
  } catch (error) {
    console.error(`Could not read metadata for file: ${filePath}`, error);
    // Return 0 or throw the error, depending on how you want to handle failures
    return 0;
  }
}

async function main() {
  // Your initial song data, without the duration
  const songsData = [
    {
      id: "13e8d1d1-bc6e-4447-911d-9adb00981888",
      title: "Switzerland",
      song_url: "public/audio/nature_1_river.mp3",
      category: "Nature's Bliss"
    },
    {
      id: "1e55b82d-2e96-4c99-bc8b-d2c7c86f002a",
      title: "Finland",
      song_url: "public/audio/nature_2_forest.mp3",
      category: "Nature's Bliss"
    },
    {
      id: "6b39fcfa-63f1-44e9-933d-9b6f9ded71bf",
      title: "Iceland",
      song_url: "public/audio/nature_3_snowfall.mp3",
      category: "Nature's Bliss"
    },
    {
      id: "4bb8b84d-94c0-4ee6-86e8-ad43d3fede7c",
      title: "Australia",
      song_url: "public/audio/nature_4_insects.mp3",
      category: "Nature's Bliss"
    },
    {
      id: "67e470ba-3132-4e55-9ee6-269219232683",
      title: "Netherlands", // Corrected typo
      song_url: "public/audio/nature_5_spring.mp3",
      category: "Nature's Bliss"
    },
    {
      id: "7facc4eb-40fd-401e-9006-04b945b89b6a",
      title: "Ireland",
      song_url: "public/audio/nature.mp3",
      category: "Nature's Bliss"
    },

    {
      id: "c3e3e0b8-9cb6-4a4e-a1e6-23641b99a671",
      title: "Switzerland",
      song_url: "public/audio/white_1_wind.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "8d4f8a37-9b6d-4c3e-b81f-7e9a2b5d4c8e",
      title: "Finland",
      song_url: "public/audio/white_2_Thunderstorm.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "f7b2a1c9-6d8e-4f5a-9b3c-1e4d7f6a2b8d",
      title: "Iceland",
      song_url: "public/audio/white_3.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "a1b3c4d5-e6f7-4a8b-9c1d-2e3f4a5b6c7d",
      title: "Australia",
      song_url: "public/audio/white_4.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Neatherlands",
      song_url: "public/audio/white_5.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "d9e8f7a6-b5c4-4d3e-8f2a-1b9c8d7e6f5a",
      title: "Ireland",
      song_url: "public/audio/white_6.mp3",
      category: "White Noise & Frequency"
    },
    {
      id: "2a1b3c4d-5e6f-4a8b-9c1d-2e3f4a5b6c7d",
      title: "Switzerland",
      song_url: "public/audio/ambience_1_supermarket.mp3",
      category: "Ambience"
    },
    {
      id: "9e8f7a6b-5c4d-4e3f-8a2b-1c9d8e7f6a5b",
      title: "Finland",
      song_url: "public/audio/ambience_2_coffee.mp3",
      category: "Ambience"
    },
    {
      id: "6f5a4b3c-2d1e-4f8a-9b7c-6d5e4f3a2b1c",
      title: "Iceland",
      song_url: "public/audio/ambience_3_library.mp3",
      category: "Ambience"
    },
    {
      id: "1b3c2d4e-5f6a-4b8c-9d1e-2f3a4b5c6d7e",
      title: "Australia",
      song_url: "public/audio/ambience_4_mall.mp3",
      category: "Ambience"
    },
    {
      id: "7a6b5c4d-3e2f-4a1b-8c9d-7e6f5a4b3c2d",
      title: "Neatherlands",
      song_url: "public/audio/ambience_5_fireplace.mp3",
      category: "Ambience"
    },
    {
      id: "4e3f2a1b-8c9d-4e7f-6a5b-4c3d2e1f9b8a",
      title: "Ireland",
      song_url: "public/audio/ambience_6_water.mp3",
      category: "Ambience"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Switzerland",
      song_url: "public/audio/classic_1.mp3",
      category: "Classical Serenity"
    },
    {
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      title: "Finland",
      song_url: "public/audio/classic_2.mp3",
      category: "Classical Serenity"
    },
    {
      id: "8f14e45f-ceea-467a-9f59-7b3c5e8d2a1c",
      title: "Iceland",
      song_url: "public/audio/classic_3.mp3",
      category: "Classical Serenity"
    },
    {
      id: "3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b",
      title: "Australia",
      song_url: "public/audio/classic_4.mp3",
      category: "Classical Serenity"
    },
    {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      title: "Neatherlands",
      song_url: "public/audio/classic_5.mp3",
      category: "Classical Serenity"
    },
    {
      id: "b12e4567-e89b-12d3-a456-426614174000",
      title: "Ireland",
      song_url: "public/audio/classic_6.mp3",
      category: "Classical Serenity"
    },
    {
      id: "9fbc1fa3-7a61-4e0b-9d2b-88b18ed6a59c",
      title: "Switzerland",
      song_url: "public/audio/asmr_1.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "7ea9c6b2-3395-4c78-991c-ff27354d5d7f",
      title: "Finland",
      song_url: "public/audio/asmr_2.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "5cb4294c-bbe5-46c4-902c-b4f648e2e8a1",
      title: "Iceland",
      song_url: "public/audio/asmr_3.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "0e8e712f-4023-4769-82b5-22c7ab8f0cf2",
      title: "Australia",
      song_url: "public/audio/asmr_4.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "f6bdf402-6465-4c5d-b147-cd3c78653a48",
      title: "Neatherlands",
      song_url: "public/audio/asmr_5.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "3b3ccf97-fb98-48db-b19f-d77ae47a14a6",
      title: "Ireland",
      song_url: "public/audio/asmr_6.mp3",
      category: "ASMR Bliss"
    },
    {
      id: "2c1e62af-44b3-4e8a-b7a3-2b33f6e07df1",
      title: "Switzerland",
      song_url: "public/audio/chant_1.mp3",
      category: "Mantras and Chants"
    },
    {
      id: "c58914a7-c6c0-4c9b-9a77-d4bb8f064a47",
      title: "Finland",
      song_url: "public/audio/chant_2.mp3",
      category: "Mantras and Chants"
    },
    {
      id: "8af54d91-3c0a-4aeb-91f6-3fc7322c8626",
      title: "Iceland",
      song_url: "public/audio/chant_3.mp3",
      category: "Mantras and Chants"
    },
    {
      id: "6dbe3104-0e63-48c1-bb63-e6b0c0195a0b",
      title: "Australia",
      song_url: "public/audio/chant_4.mp3",
      category: "Mantras and Chants"
    },
    {
      id: "0bbf84dc-9833-4c5c-8b9f-e2f58c4e3e5e",
      title: "Neatherlands",
      song_url: "public/audio/chant_5.mp3",
      category: "Mantras and Chants"
    },
    { 
      id: "93b45b2c-6404-4625-901c-e346fe40c539",
      title: "Ireland",
      song_url: "public/audio/chant_6.mp3",
      category: "Mantras and Chants"
    }


  ];

  // Map over the song data and create a promise for each one that resolves
  // with the complete song object, including the duration.
  const dataWithDurationPromises = songsData.map(async (song) => {
    const duration = await getAudioDuration(song.song_url);
    return {
      ...song,
      duration: duration,
    };
  });

  // Wait for all the promises to resolve
  const finalData = await Promise.all(dataWithDurationPromises);

  console.log("Preparing to seed songs with calculated durations...");
  console.log(finalData);

  // Now seed the database with the complete data
  await prisma.song.createMany({
    data: finalData,
  });

  console.log("Seeded songs successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
