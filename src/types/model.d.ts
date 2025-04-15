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
  interface IUserLogin {
    email: string;
    password: string;
  }
  interface IFetchUser {
    userId: string;
    email: string;
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
}
