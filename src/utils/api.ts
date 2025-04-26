import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
