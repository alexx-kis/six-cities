import { describe, expect, it } from 'vitest';
import { DataStatus, DEFAULT_CITY_LOCATION, DEFAULT_CITY_NAME, LOCATIONS, SortingOption } from '../../const';
import { makeFakePlaceCard, makeFakePlaceCardForCity } from '../../utils/mocks';
import { defineCityLocation, getOffersByCityName, sortOffers, updateFavoriteStatus } from '../../utils/utils';
import { addToFavoritesAction, fetchOffersAction, removeFromFavoritesAction } from '../api-action';
import { changeCity, changeSortingType, offersProcess } from './offers-process.slice';

describe('OffersProcess Slice', () => {
  const emptyAction = { type: '' };

  it('Should return initial state with empty action', () => {
    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: Array.from({ length: 120 }, makeFakePlaceCard),
      sorted: Array.from({ length: 20 }, makeFakePlaceCard),
      sortingType: SortingOption.Popular,
      status: DataStatus.Unknown,
    };
    const result = offersProcess.reducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('Should return default initial state with empty action and undefined state', () => {
    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: [],
      sorted: [],
      sortingType: SortingOption.Popular,
      status: DataStatus.Unknown,
    };
    const result = offersProcess.reducer(undefined, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('Should change city with changeCity action', () => {
    const mockOffers = [
      ...Array.from({ length: 100 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
      ...Array.from({ length: 20 }, () => makeFakePlaceCardForCity(LOCATIONS[1])),
    ];

    const initialState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: mockOffers,
      sorted: getOffersByCityName(mockOffers, DEFAULT_CITY_NAME),
      sortingType: SortingOption.Popular,
      status: DataStatus.Unknown,
    };
    const expectedState = {
      cityName: LOCATIONS[1],
      cityLocation: defineCityLocation(getOffersByCityName(mockOffers, LOCATIONS[1])),
      all: mockOffers,
      sorted: getOffersByCityName(mockOffers, LOCATIONS[1]),
      sortingType: SortingOption.Popular,
      status: DataStatus.Unknown,
    };
    const result = offersProcess.reducer(initialState, changeCity(LOCATIONS[1]));
    expect(result).toEqual(expectedState);
  });

  it('Should change sorting type with changeSortingType action', () => {
    const fakeOffers = [
      ...Array.from({ length: 100 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
      ...Array.from({ length: 20 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
    ];

    const initialState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: fakeOffers,
      sorted: getOffersByCityName(fakeOffers, DEFAULT_CITY_NAME),
      sortingType: SortingOption.Popular,
      status: DataStatus.Unknown,
    };

    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: fakeOffers,
      sorted: sortOffers(getOffersByCityName(fakeOffers, DEFAULT_CITY_NAME), SortingOption.ByHighPrice),
      sortingType: SortingOption.ByHighPrice,
      status: DataStatus.Unknown,
    };

    const result = offersProcess.reducer(initialState, changeSortingType(SortingOption.ByHighPrice));

    expect(result).toEqual(expectedState);
  });

  it('Should set "status" to "loading" with "fetchOffersAction.pending"', () => {
    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: [],
      sorted: [],
      sortingType: SortingOption.Popular,
      status: DataStatus.Loading,
    };

    const result = offersProcess.reducer(undefined, fetchOffersAction.pending);
    expect(result).toEqual(expectedState);
  });

  it('Should set "status" to "loaded", "all" to array with all offers, "sorted" to array with offers by city, "cityLocation" to location object with "fetchOffersAction.fulfilled"', () => {
    const mockOffers = [
      ...Array.from({ length: 100 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
      ...Array.from({ length: 20 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
    ];

    const mockSortedOffers = getOffersByCityName(mockOffers, DEFAULT_CITY_NAME);

    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: defineCityLocation(mockSortedOffers),
      all: mockOffers,
      sorted: mockSortedOffers,
      sortingType: SortingOption.Popular,
      status: DataStatus.Loaded,
    };

    const result = offersProcess.reducer(
      undefined,
      fetchOffersAction.fulfilled(mockOffers, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('Should set "status" to "error" with "fetchOffersAction.rejected", ', () => {
    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: [],
      sorted: [],
      sortingType: SortingOption.Popular,
      status: DataStatus.Error,
    };

    const result = offersProcess.reducer(undefined, fetchOffersAction.rejected);

    expect(result).toEqual(expectedState);
  });

  it('Should update all offers and sorted offers with "addToFavoritesAction.fulfilled"', () => {
    const mockOffers = [
      ...Array.from({ length: 100 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
      ...Array.from({ length: 20 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
    ];
    const mockPayload = mockOffers[0];
    const mockUpdatedOffers = updateFavoriteStatus(mockOffers, mockPayload, true);

    const mockSortedOffers = getOffersByCityName(mockOffers, DEFAULT_CITY_NAME);
    const mockUpdatedSortedOffers = getOffersByCityName(mockUpdatedOffers, DEFAULT_CITY_NAME);


    const initialState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: mockOffers,
      sorted: mockSortedOffers,
      sortingType: SortingOption.Popular,
      status: DataStatus.Loaded,
    };

    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: mockUpdatedOffers,
      sorted: mockUpdatedSortedOffers,
      sortingType: SortingOption.Popular,
      status: DataStatus.Loaded,
    };

    const result = offersProcess.reducer(initialState, addToFavoritesAction.fulfilled(mockPayload, mockPayload.id, ''));

    expect(result).toEqual(expectedState);
  });

  it('Should update all offers and sorted offers with "removeFromFavoritesAction.fulfilled"', () => {
    const mockOffers = [
      ...Array.from({ length: 100 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
      ...Array.from({ length: 20 }, () => makeFakePlaceCardForCity(DEFAULT_CITY_NAME)),
    ];
    const mockPayload = mockOffers[0];
    const mockUpdatedOffers = updateFavoriteStatus(mockOffers, mockPayload, false);

    const mockSortedOffers = getOffersByCityName(mockOffers, DEFAULT_CITY_NAME);
    const mockUpdatedSortedOffers = getOffersByCityName(mockUpdatedOffers, DEFAULT_CITY_NAME);


    const initialState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: mockOffers,
      sorted: mockSortedOffers,
      sortingType: SortingOption.Popular,
      status: DataStatus.Loaded,
    };

    const expectedState = {
      cityName: DEFAULT_CITY_NAME,
      cityLocation: DEFAULT_CITY_LOCATION,
      all: mockUpdatedOffers,
      sorted: mockUpdatedSortedOffers,
      sortingType: SortingOption.Popular,
      status: DataStatus.Loaded,
    };

    const result = offersProcess.reducer(initialState, removeFromFavoritesAction.fulfilled(mockPayload, mockPayload.id, ''));

    expect(result).toEqual(expectedState);
  });
});
