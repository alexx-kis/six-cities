import { store } from './store';
import { AuthorizationStatus, DataStatus } from './const';

// %======================== types ========================% //

export type InitialState = {
  auth: {
    status: AuthorizationStatus;
    login: string | null;
  };
  city: {
    name: string;
    location: LocationType;
  };
  offers: {
    all: PlaceCardType[];
    sorted: PlaceCardType[];
    sortingType: string;
    status: DataStatus;
  };
  offer: {
    data: OfferType;
    status: DataStatus;
  };
  nearPlaces: {
    data: PlaceCardType[];
    status: DataStatus;
  };
  reviews: {
    data: ReviewType[];
    status: DataStatus;
  };
  favoriteOffers: {
    data: PlaceCardType[];
    status: DataStatus;
  };
};

export type LocationType = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type ReviewType = {
  id: string;
  comment: string;
  date: string;
  rating: number;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
};

export type CityType = {
  name: string;
  location: LocationType;
};

export type PlaceCardType = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: CityType;
  location: LocationType;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
};

export type OfferType = Omit<PlaceCardType, 'previewImage'> & {
  description: string;
  images: string[];
  goods: string[];
  host: {
    isPro: boolean;
    name: string;
    avatarUrl: string;
  };
  bedrooms: number;
  maxAdults: number;
};

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type DetailMessageType = {
  type: string;
  message: string;
};

export type UserData = {
  id: number;
  email: string;
  token: string;
};

export type AuthData = {
  login: string;
  password: string;
};

export type AuthResponse = {
  email: string;
};

export type ReviewData = {
  rating: number;
  comment: string;
};
