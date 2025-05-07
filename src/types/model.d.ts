export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
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
    email: string;
    adminSecret?: string;
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
}
