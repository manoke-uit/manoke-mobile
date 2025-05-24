import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";

export const confirmEmailAPI = (token: string) => {
  const url = `/auth/confirm-email`;
  return axios.post<{ success: boolean; message: string }>(url, { token });
};

export const confirmVerificationAPI = (payload: {
  email: string;
  otp: string;
  type: string;
}) => {
  const url = `/auth/confirm-verification`;
  return axios.post<{ success: boolean; message: string }>(url, payload);
};

export const registerAPI = (
  email: string,
  password: string,
  displayName: string
) => {
  const url = `/auth/signup`;
  return axios.post<{ message: string }>(url, { email, password, displayName });
};

export const loginAPI = (email: string, password: string) => {
  const url = `/auth/login`;
  return axios.post<ILogin>(url, { email, password });
};

export const forgotPasswordAPI = (email: string) => {
  const url = `/auth/forgot-password`;
  return axios.post<{ message: string }>(url, { email });
};

export const resetPasswordAPI = (
  email: string,
  newPassword: string,
  verifyNewPassword: string
) => {
  const url = `/auth/reset-password`;
  return axios.post<{ message: string }>(url, {
    email,
    newPassword,
    verifyNewPassword,
  });
};

export const printAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
      let asyncStorage: any = {};
      stores?.map((result, i, store) => {
        asyncStorage[store[i][0]] = store[i][1];
      });
    });
  });
};

export const getAccountAPI = () => {
  const url = `/profile`;
  return axios.get<IFetchUser>(url);
};

export const getAllSongs = (genreId?: string, artistId?: string) => {
  const params: any = {};
  if (genreId) params.genreId = genreId;
  if (artistId) params.artistId = artistId;

  return axios.get<IBackendRes<ISong[]>>("/songs", { params });
};

export const changePasswordAPI = (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const url = `/auth/change-password`;
  return axios.post(url, payload);
};

export const createScoreAPI = (payload: {
  audioUrl: string;
  finalScore: number;
  userId: string;
  songId: string;
  createdAt: string;
}) => {
  const url = `/scores`;
  return axios.post<IScore>(url, payload);
};

export const createPlaylistAPI = (payload: {
  title: string;
  userId: string;
  imageUrl?: string;
  description?: string;
  songIds?: string[];
}) => {
  const url = `/playlists`;
  return axios.post<IPlaylist>(url, payload);
};

export const getPlaylistsAPI = () => {
  const url = `/playlists`;
  return axios.get(url);
};

export const updatePlaylistAPI = (
  playlistId: string,
  payload: Partial<{
    title?: string;
    imageUrl?: string;
    songIds?: string[];
    isPublic?: boolean;
  }>
) => {
  const url = `/playlists/${playlistId}`;
  return axios.patch<IPlaylist>(url, payload);
};

export const uploadAvatar = async (fileUri: string, userId: string) => {
  try {
    const fileName = `${userId}_${Date.now()}.jpg`;
    const response = await fetch(fileUri);
    if (!response.ok) throw new Error("Cannot fetch image from URI.");
    const blob = await response.blob();
    if (blob.size > 4 * 1024 * 1024) {
      throw new Error("Image size exceeds 4MB");
    }

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });
    if (error) {
      console.error("Failed to upload Supabase ", error.message);
      return null;
    }
    const url = supabase.storage.from("avatars").getPublicUrl(fileName)
      .data.publicUrl;
    return url;
  } catch (err) {
    console.error("Failed to upload: ", err);
    return null;
  }
};

export const searchYoutubeAPI = (query: string, pageToken: string) => {
  const url = `/youtube/search`;
  return axios.get<IYoutubeSearchResponse>(url, {
    params: {
      query,
      pageToken,
    },
  });
};

export const uploadScoreAudioAPI = async (
  fileUri: string,
  songId: string,
  userId: string
) => {
  const url = `/scores/score`;
  const formData = new FormData();
  const filename = fileUri.split("/").pop()!;
  const fileType = filename.split(".").pop();
  formData.append("file", {
    uri: fileUri,
    name: filename,
    type: `audio/${fileType}`,
  } as any);
  formData.append("songId", songId);
  formData.append("userId", userId);
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Upload audio failed:", error);
    throw error;
  }
};

export const createPostAPI = async (payload: {
  userId: string;
  description: string;
  scoreId: string;
}) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/posts`;
  return axios.post<IPost>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPostsAPI = async (page: number = 1, limit: number = 10) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/posts`;
  return axios.get<IPaginatedPosts>(url, {
    params: { page, limit },
  });
};

export const deletePostAPI = async (postId: string) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/posts/${postId}`;
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCommentAPI = async (payload: {
  comment: string;
  postId: string;
}) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/comments`;
  return axios.post<IComment>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchUsersAPI = async (email: string) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/users/email`;
  return axios.get<IBackendRes<IUser>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { email },
  });
};

export const createFriendRequestAPI = async (receiverId: string) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/friends`;
  return axios.post<IFriend>(
    url,
    { receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateFriendRequestAPI = async (
  receiverId: string,
  status: "accepted" | "rejected"
) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/friends/${receiverId}`;
  return axios.patch<IFriend>(
    url,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getFriendsAPI = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/friends`;
  return axios.get<IFriend[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFriendRequestsAPI = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/friends/requests`;
  return axios.get<IFriend[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeFriendAPI = async (id: string) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/friends/${id}`;
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserByIdAPI = async (userId: string) => {
  const url = `/users/${userId}`;
  return axios.get(url);
};

export const updateUserAPI = (
  id: string,
  email: string,
  displayName: string,
  avatar?: { uri: string; name: string; type: string }
) => {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("displayName", displayName);

  if (avatar) {
    formData.append("avatar", {
      uri: avatar.uri,
      name: avatar.name,
      type: avatar.type,
    } as any);
  }

  return axios.patch(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const searchSongsByTitleAPI = (q: string) => {
  return axios.get("/songs/search/title", {
    params: { q },
  });
};
export const searchSongsByArtistAPI = (q: string) => {
  return axios.get("/songs/search/artist", {
    params: { q },
  });
};
export const searchPlaylistsByTitleAPI = (searchTitle: string) => {
  return axios.get(`/playlists/${searchTitle}`);
};
export const getSongsInPlaylistAPI = (playlistId: string) => {
  return axios.get(`/playlists/${playlistId}/songs`);
};
export const getKaraokesBySongId = async (songId: string) => {
  return await axios.get(`/karaokes/song/${songId}`);
};

export const deleteKaraokeAPI = async (karaokeId: string) => {
  return await axios.delete(`/karaokes/${karaokeId}`);
};

export const getSongById = async (songId: string) => {
  return await axios.get(`/songs/${songId}`);
};

export const getPlaylistById = async (playlistId: string) => {
  return await axios.get(`/playlists/${playlistId}`);
};
export const getAllScores = async () => {
  return await axios.get("/scores");
};
export const createNotification = async (data: {
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
  deviceId: string;
}) => {
  const res = await axios.post("/notifications", data);
  return res;
};

export const getNotifications = async (userId: string) => {
  const res = await axios.get("/notifications", {
    params: { userId },
  });
  return res;
};
export const getUnreadNotificationCount = async (
  userId: string
): Promise<number> => {
  const res = await axios.get("/notifications/unread-count", {
    params: { userId },
  });
  return res;
};
export const registerOrUpdateExpoPushTokenAPI = async (
  userId: string,
  expoPushToken: string
) => {
  const res = await axios.post("/users/registerOrUpdateExpoPushToken", {
    userId,
    expoPushToken,
  });
  return res;
};
export const updateUserImageAPI = async (
  userId: string,
  image: {
    uri: string;
    name: string;
    type: string;
  }
) => {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);

  const res = await axios.patch(`/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const createSongAPI = (formData: FormData) => {
  return axios.post("/songs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createKaraokeAPI = (formData: FormData) => {
  return axios.post("/karaokes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllOwnKaraokesAPI = () => {
  return axios.get<IBackendRes<IKaraoke[]>>("/karaokes/own");
};

export const requestPublicKaraokeAPI = (karaokeId: string) => {
  return axios.get<IBackendRes<IKaraoke>>(`/karaokes/public/${karaokeId}`);
};

export const createArtistAPI = (payload: ICreateArtistPayload) => {
  return axios.post("/artists", payload);
};
