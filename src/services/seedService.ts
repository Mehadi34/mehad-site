import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';

const DEMO_BOOKS = [
  {
    title: "কুফর তাকফির বিদআত-প্রান্তিকতা ও ভারসাম্য",
    author: "মূল: শায়েখ সালিহ আল ফাওযান",
    category: "সাধারণ",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    status: "available",
    bookCode: "GEN-7618",
    shelfNo: "N/A",
    price: 150,
    tags: ["সাধারণ", "এটইলেবল"]
  },
  {
    title: "তাফসীর ইবন কাসীর (১০,১১) খন্ড",
    author: "হাফিজ ইমাদউদ্দীন ইবন কাসীর (রঃ)",
    category: "ইসলামী বই",
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400",
    status: "available",
    bookCode: "ISL-002",
    shelfNo: "Shelf-1",
    price: 450,
    tags: ["ইসলামী", "পপুলার"]
  },
  {
    title: "সায়েন্স ফিকশন সবুজ মানব",
    author: "হুমায়ূন আহমেদ",
    category: "সায়েন্স ফিকশন",
    imageUrl: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&q=80&w=400",
    status: "available",
    bookCode: "SCI-101",
    shelfNo: "Shelf-2",
    price: 220,
    tags: ["সায়েন্স ফিকশন", "প্রটইলেবল"]
  },
  {
    title: "সাতকাহন (অখণ্ড)",
    author: "সমরেশ মজুমদার",
    category: "উপন্যাস",
    imageUrl: "https://images.unsplash.com/photo-1543005187-9eb71dda8e81?auto=format&fit=crop&q=80&w=400",
    status: "available",
    bookCode: "NOV-505",
    shelfNo: "N/A",
    price: 550,
    tags: ["উপন্যাস", "এটইলেবল"]
  }
];

export const seedDemoData = async () => {
  const booksRef = collection(db, 'books');
  const q = query(booksRef, limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    try {
      console.log('Seeding demo books...');
      for (const book of DEMO_BOOKS) {
        await addDoc(booksRef, book);
      }
      console.log('Demo books added successfully!');
    } catch (error) {
      console.warn('Seeding failed (likely due to permissions):', error);
    }
  }
};
