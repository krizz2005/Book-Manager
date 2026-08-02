import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Book } from '@/models/Book';
import { verifyToken } from '@/lib/jwt';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// PUT /api/books/[id] - Update book or quick-change status
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, userId: user.userId }, // Ensure user owns the book
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book updated', book: updatedBook });
  } catch (error) {
    console.error('Update book error:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE /api/books/[id] - Remove book
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await connectDB();

    const deletedBook = await Book.findOneAndDelete({ _id: id, userId: user.userId });

    if (!deletedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted' });
  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}