// lib/data.ts

export type Item = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string; // optional,
  songUrl: string
};

export const items: Item[] = [
  {
    id: 0,
    name: "Switzerland",
    description: "This is the first item's description.",
    imageUrl: "https://i.ibb.co/qCkd9jS/img1.jpg",
    songUrl: "/audio/nature.mp3"
  },
  {
    id: 1,
    name: "Finland",
    description: "This is the second item's description.",
    imageUrl: "https://i.ibb.co/jrRb11q/img2.jpg",
    songUrl: "/audio/nature.mp3"
  },
  {
    id: 2,
    name: "Iceland",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/NSwVv8D/img3.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: 3,
    name: "Australia",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/Bq4Q0M8/img4.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: 4,
    name: "Neatherlands",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/jTQfmTq/img5.jpg",
    songUrl: "/audio/nature.mp3"
  },
    {
    id: 5,
    name: "Ireland",
    description: "This is the third item's description.",
    imageUrl: "https://i.ibb.co/RNkk6L0/img6.jpg",
    songUrl: "/audio/nature.mp3"
  },
];
