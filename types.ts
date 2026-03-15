export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  coverURL?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Post {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  likesCount: number;
  commentsCount: number;
  createdAt: any;
}

export interface Message {
  id: string;
  chatId: string;
  senderUid: string;
  text: string;
  mediaUrl?: string;
  createdAt: any;
}

export interface Story {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  mediaUrl: string;
  createdAt: any;
  expiresAt: any;
}

export interface Notification {
  id: string;
  recipientUid: string;
  senderUid: string;
  senderName: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  postId?: string;
  createdAt: any;
  read: boolean;
}
