import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeResponse, FruitInfo, FruitSummary, HistoryResponse } from '../types/fruit';

const BASE_URL = 'http://10.0.2.2:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
    this.client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      const token = await AsyncStorage.getItem('access_token');
      if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  get auth() {
    return {
      login: (email: string, password: string) => this.client.post('/auth/login', { email, password }).then(r => r.data),
      register: (email: string, password: string) => this.client.post('/auth/register', { email, password }).then(r => r.data),
    };
  }

  get analyze() {
    return {
      analyzeImage: (file: FormData): Promise<AnalyzeResponse> =>
        this.client.post('/analyze', file, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
      getHistory: (page = 0, size = 10): Promise<HistoryResponse> =>
        this.client.get(`/analyze/history?page=${page}&size=${size}`).then(r => r.data),
      getById: (id: number): Promise<AnalyzeResponse> =>
        this.client.get(`/analyze/${id}`).then(r => r.data),
    };
  }

  get fruits() {
    return {
      list: (): Promise<FruitSummary[]> => this.client.get('/fruits').then(r => r.data),
      getByName: (name: string): Promise<FruitInfo> =>
        this.client.get(`/fruits/${encodeURIComponent(name)}`).then(r => r.data),
    };
  }
}

export const api = new ApiClient();
