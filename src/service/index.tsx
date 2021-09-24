import axios from 'axios';
import { format } from 'date-fns';

const BASE_URL = 'https://osf-rn-training-bff.herokuapp.com';

interface Trailer {
  url: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface Movie {
  id: string;
  title: string;
  contentRating: string;
  synopsis: string;
  posterPortraitUrl: string | null;
  posterHorizontalUrl: string | null;
  trailers: Trailer[];
}

export interface Session {
  id: number;
  name: string;
  rooms: Array<{
    name: string;
    sessions: Array<{
      id: number;
      time: string;
      types: Array<{
        id: number;
        alias: string;
      }>;
    }>;
  }>;
}

export const getCities = () => {
  return axios.get<City[]>(`${BASE_URL}/cities`);
};

export const getMovies = (cityId: number) => {
  return axios.get<Movie[]>(`${BASE_URL}/movies/city/${cityId}`);
};

export const getSessions = (cityId: number, movieId: string, date: Date) => {
  const dateFormatted = format(date, 'yyyy-MM-dd');
  return axios.get<Session[]>(
    `${BASE_URL}/movies/${movieId}/sessions/date/${dateFormatted}?cityId=${cityId}`,
  );
};
