export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }
  interface Pagination<T> {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }
  export interface IPaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
  interface IRegister {
    displayName: string;
    email: string;
    password: string;
  }
  interface ILogin {
    accessToken: string;
  }
  export interface IFetchUser {
    userId: string;
    displayName: string;
    email: string;
    adminSecret?: string;
    password?: string;
    imageUrl?: string;
    createdAt: string;
    playlistIds: string[];
    scoreIds: string[];
    karaokeIds: string[];
    postIds: string[];
    commentIds: string[];
  }
  export interface ISong {
    title: string;
    albumTitle: string;
    imageUrl: string;
    releasedDate: Date;
    duration: number;
    youtubeUrl: string;
    spotifyUrl: string;
    artistIds: string[];
    playlistIds: string[];
    scoreIds: string[];
  }
  export interface IPaginatedSongs {
    items: ISong[];
    meta: IPaginationMeta;
  }
  export interface IScore {
    id: string;
    audioUrl: string;
    finalScore: number;
    userId: string;
    songId: string;
    createdAt: string;
  }
  export interface IPaginatedScores {
    items: IScore[];
    meta: IPaginationMeta;
  }
  export interface IPlaylist {
    title: string;
    userId: string;
    imageUrl: string;
    description: string;
    songIds: string[];
  }
  export interface IPaginatedPlaylists {
    items: IPlaylist[];
    meta: IPaginationMeta;
  }
  interface IYoutubeResult {
    title: string;
    videoId: string;
    embedUrl: string;
    isEmbedded: boolean;
    thumbnailUrl: string;
  }
  interface IYoutubeSearchResponse {
    results: IYoutubeResult[];
    nextPageToken: string;
    prevPageToken: string;
  }
  export interface IPost {
    id: string;
    description: string;
    createdAt: string;
    user: { id: string; displayName: string };
    score: {
      id: string;
      audioUrl: string;
      finalScore: number;
      song: { id: string; title: string };
    };
    comments: { id: string; comment: string; user: { id: string; displayName: string } }[];
  }
  export interface IPaginatedPosts {
    items: IPost[];
    meta: IPaginationMeta;
  }
  export interface IComment {
    id: string;
    comment: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      displayName: string;
    };
    postId: string;
  }
  export interface IFriend {
    userId_1: string;
    userId_2: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    user_1: {
      id: string;
      displayName: string;
    };
    user_2: {
      id: string;
      displayName: string;
    };
  }
  export interface IPaginatedFriends {
    items: IFriend[];
    meta: IPaginationMeta;
  }
  export interface IUser {
    id: string;
    displayName: string;
    email: string;
  }
}