export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  signed_in: boolean;
}
export class Article {
  id: number;
  author_id: number;
  title: string;
  content: string;
}
export class Comment {
  id: number;
  article_id: number;
  author_id: number;
  content: string;
}
