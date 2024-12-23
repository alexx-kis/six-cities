import { StatusCodes } from 'http-status-codes';

// *======================== const ========================* //
// *------------ data ------------* //
export const LOCATIONS: string[] = [
  'paris',
  'cologne',
  'brussels',
  'amsterdam',
  'hamburg',
  'dusseldorf',
];

export const RATING_OPTIONS = [
  {
    value: 5,
    title: 'perfect',
  },
  {
    value: 4,
    title: 'good',
  },
  {
    value: 3,
    title: 'not bad',
  },
  {
    value: 2,
    title: 'badly'
  },
  {
    value: 1,
    title: 'terribly'
  }
];

// *------------ view ------------* //
export enum CardListType {
  CITIES = 'cities',
  FAVORITES = 'favorites',
  NEAR_PLACES = 'near-places'
}

export enum SortingOption {
  POPULAR = 'Popular',
  BY_LOW_PRICE = 'Price: low to high',
  BY_HIGHT_PRICE = 'Price: high to low',
  BY_RATING = 'Top rated first',
}

export const DATE_FORMAT: string = 'MMMM YYYY';

export const URL_MARKER_DEFAULT =
  '../img/pin.svg';

export const URL_MARKER_CURRENT =
  '../img/pin-active.svg';

export const DEFAULT_CITY_NAME = 'paris';

export const DEFAULT_CITY_LOCATION = {
  latitude: 48.85661,
  longitude: 2.351499,
  zoom: 13
};

export enum AppRoute {
  Main = '/',
  Favorites = '/favorites',
  Offer = '/offer/:id',
  Login = '/login',
  NotFound = '*'
}

// *------------ network ------------* //
export enum APIRoute {
  Offers = '/offers'
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
export const BACKEND_URL = 'https://16.design.htmlacademy.pro/six-cities';
export const REQUEST_TIMEOUT = 5000;


export const TIMEOUT_SHOW_ERROR = 2000;

export const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true,
};
