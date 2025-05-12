import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";

export const confirmEmailAPI = (token: string) => {
  const url = `/auth/confirm-email`;
  return axios.post<{ email: string; message: string }>(url, { token });
};

export const registerAPI = (email: string, password: string, displayName: string) => {
  const url = `/auth/signup`;
  return axios.post<{ message: string }>(url, { email, password, displayName });
};

export const loginAPI = (email: string, password: string) => {
  const url = `/auth/login`;
  return axios.post<ILogin>(url, { email, password });
};

export const printAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
      let asyncStorage: any = {};
      stores?.map((result, i, store) => {
        asyncStorage[store[i][0]] = store[i][1];
      });
      console.log(JSON.stringify(asyncStorage, null, 2));
    });
  });
};

export const getAccountAPI = () => {
  const url = `/profile`;
  return axios.get<IFetchUser>(url);
};

export const getAllSongs = async (page: number = 1, limit: number = 10) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const url = `/songs`;
  return axios.get<IBackendRes<IPaginatedSongs>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
};

export const changePasswordAPI = (userId: string, newPassword: string) => {
  const url = `/users/${userId}`;
  return axios.patch(url, { password: newPassword });
};
export const getScoresAPI = () => {
  const url = `/scores`;
  return axios.get<IPaginatedScores>(url);
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
  imageUrl: string;
  description: string;
  songIds: string[];
}) => {
  const url = `/playlists`;
  return axios.post<IPlaylist>(url, payload);
};
export const getPlaylistsAPI = () => {
  const url = `/playlists`;
  return axios.get<IPaginatedPlaylists>(url);
};
export const updatePlaylistAPI = (
  playlistId: string,
  payload: Partial<{
    title: string;
    imageUrl: string;
    description: string;
    songIds: string[];
  }>
) => {
  const url = `/playlists/${playlistId}`;
  return axios.patch<IPlaylist>(url, payload);
};

export const uploadAvatar = async (fileUri: string, userId: string) => {
  try {
    const fileName = `${userId}_${Date.now()}.jpg`;

    const response = await fetch(fileUri);
    if (!response.ok) throw new Error("Không thể tải ảnh từ URI");

    const blob = await response.blob();

    if (blob.size > 4 * 1024 * 1024) {
      throw new Error("Ảnh vượt quá 4MB");
    }
    console.log("userId:", userId);
    console.log("fileName:", fileName);
    console.log("blob.type:", blob.type);
    console.log("blob.size:", blob.size);

    const { error } = await supabase.storage
      .from("avatar")
      .upload(fileName, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Lỗi khi upload lên Supabase:", error.message);
      return null;
    }

    const url = supabase.storage.from("avatar").getPublicUrl(fileName)
      .data.publicUrl;

    return url;
  } catch (err) {
    console.error("Upload thất bại:", err);
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
    return response.data;
  } catch (error) {
    console.error("Upload audio failed:", error);
    throw error;
  }
};
