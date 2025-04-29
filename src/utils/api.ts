import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
export const registerAPI = (email: string, password: string, name: string) => {
  const url = `/auth/signup`;
  return axios.post<IRegister>(url, { email, password, name });
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
export const getAllSongs = () => {
  const url = `/songs`;
  return axios.get<IPaginatedSongs>(url);
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
export const uploadAvatar = async (fileUri: string, userId: string) => {
  const fileName = `${userId}_${Date.now()}.jpg`;

  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error);
    return null;
  }

  const url = supabase.storage.from("avatars").getPublicUrl(fileName)
    .data.publicUrl;
  return url;
};
