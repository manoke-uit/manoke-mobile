import axios from "@/utils/api.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const registerAPI = (email: string, password: string, name: string) => {
  const url = `/api/v1/auth/register`;
  return axios.post<IBackendRes<IRegister>>(url, { email, password, name });
};
export const loginAPI = (email: string, password: string) => {
  const url = `/api/v1/auth/login`;
  return axios.post<IBackendRes<IUserLogin>>(url, { email, password });
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
  const url = `/api/v1/profile`;
  return axios.get<IBackendRes<IUserLogin>>(url);
};
