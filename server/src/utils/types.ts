export interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  imageUrl: {
    filename: string;
    originalname: string;
    path: string;
  };
  createdAt: Date;
}
