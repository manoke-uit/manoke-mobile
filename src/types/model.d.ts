export {};
declare global {
  interface IBackendRes<T> {
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
    adminSecret: string;
    password: string;
    imageUrl: string;
    createdAt: string;
    playlistIds?: string[];
    scoreIds?: string[];
    karaokeIds?: string[];
    postIds?: string[];
    commentIds?: string[];
  }
  export interface ICreateArtistPayload {
    name: string;
    imageUrl: string;
    songIds: string[];
  }
  export interface ISong {
    id: string;
    title: string;
    lyrics: string;
    songUrl: string;
    imageUrl: string;
    artists: {
      id: string;
      name: string;
      imageUrl: string;
    }[];
    playlists: {
      id: string;
      title: string;
      imageUrl: string;
      description: string;
      isPublic: boolean;
    }[];
  }

  export interface IPaginatedSongs {
    items: ISong[];
    meta: IPaginationMeta;
  }
  export interface IScore {
    id: string;
    audioUrl: string;
    finalScore: number;
    user: IUser;
    song: ISong;
    createdAt: string;
  }

  export interface IPlaylist {
    id: string;
    title: string;
    userId: string;
    imageUrl: string;
    description: string;
    isPublic: string;
    songs: string[];
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
    userId: string;
    description: string;
    createdAt: string;
    scoreId: string;
    commentIds: string[];
    user: {
      id: string;
      displayName: string;
      imageUrl?: string;
    };
    score: {
      id: string;
      audioUrl: string;
      finalScore: number;
      song: {
        id: string;
        title: string;
        imageUrl: string;
      };
    };
    comments:{
      id: string;
      comment: string;
      createdAt: string;
      user: {
        id: string;
        displayName: string;
        imageUrl?: string;
      };
    }[];
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
    id: string;
    userId_1: string;
    userId_2: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    user_1: {
      id: string;
      displayName: string;
      imageUrl?: string;
    };
    user_2: {
      id: string;
      displayName: string;
      imageUrl?: string;
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
    imageUrl?: string;
  }
  export interface IKaraoke {
    id: string;
    description: string;
    status: "public" | "private";
    song: {
      id: string;
      title: string;
      imageUrl: string;
      artists: {
        name: string;
      }[];
    };
  }
}
