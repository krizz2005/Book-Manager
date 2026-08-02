import { Schema, model, models, Document, Types } from 'mongoose';

export type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface IBook extends Document {
  userId: Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['WANT_TO_READ', 'READING', 'COMPLETED'],
      default: 'WANT_TO_READ',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing for faster tag/status queries per user
BookSchema.index({ userId: 1, status: 1 });
BookSchema.index({ userId: 1, tags: 1 });

export const Book = models.Book || model<IBook>('Book', BookSchema);