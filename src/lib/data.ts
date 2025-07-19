// lib/data.ts

export type Item = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // optional,
  songUrl: string
};

export const items: Item[] = [
  {
    id: "13e8d1d1-bc6e-4447-911d-9adb00981888",
    name: "Switzerland",
    description: "This is the first item's description.",
    imageUrl: "https://i.ibb.co/qCkd9jS/img1.jpg",
    songUrl: "/audio/nature.mp3"
  },
  {
    id: "1e55b82d-2e96-4c99-bc8b-d2c7c86f002a",
    name: "Finland",
    description: "This is the second item's description.",
    imageUrl: "https://i.ibb.co/jrRb11q/img2.jpg",
    songUrl: "/audio/nature.mp3"
  },
  {
    id: "6b39fcfa-63f1-44e9-933d-9b6f9ded71bf",
    name: "Iceland",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/NSwVv8D/img3.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: "4bb8b84d-94c0-4ee6-86e8-ad43d3fede7c",
    name: "Australia",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/Bq4Q0M8/img4.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: "67e470ba-3132-4e55-9ee6-269219232683",
    name: "Neatherlands",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/jTQfmTq/img5.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: "7facc4eb-40fd-401e-9006-04b945b89b6a",
    name: "Ireland",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/RNkk6L0/img6.jpg",
    songUrl: "/audio/nature.mp3"
  },
];
