import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Book } from '@/models/Book';
import { verifyToken } from '@/lib/jwt';

// Helper to authenticate request
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET /api/books - Fetch user's collection with filtering & search
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    await connectDB();

    const query: Record<string, unknown> = { userId: user.userId };

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ updatedAt: -1 });

    // Aggregate stats
    const allBooks = await Book.find({ userId: user.userId });
    const stats = {
      total: allBooks.length,
      wantToRead: allBooks.filter((b) => b.status === 'WANT_TO_READ').length,
      reading: allBooks.filter((b) => b.status === 'READING').length,
      completed: allBooks.filter((b) => b.status === 'COMPLETED').length,
      completionPercentage:
        allBooks.length > 0
          ? Math.round((allBooks.filter((b) => b.status === 'COMPLETED').length / allBooks.length) * 100)
          : 0,
    };

    return NextResponse.json({ books, stats });
  } catch (error) {
    console.error('Fetch books error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST /api/books - Add a new book
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, author, tags, status } = await request.json();

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and Author are required' }, { status: 400 });
    }

    await connectDB();

    const newBook = await Book.create({
      userId: user.userId,
      title,
      author,
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'WANT_TO_READ',
    });

    return NextResponse.json({ message: 'Book added', book: newBook }, { status: 201 });
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}