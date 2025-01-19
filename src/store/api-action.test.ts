import { faker } from '@faker-js/faker';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { beforeEach, describe, it } from 'vitest';
import { APIRoute } from '../const';
import { createAPI } from '../services/api';
import * as tokenStorage from '../services/token';
import { AppState, AuthData } from '../types';
import { AppThunkDispatch, extractActionsTypes, makeFakeOffer } from '../utils/mocks';
import { checkAuthAction, fetchFavoriteOffersAction, fetchOffersAction, loginAction, logoutAction } from './api-action';

describe('Async actions', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<AppState, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({ OFFERS: { all: [] } });
  });

  describe('checkAuthAction', () => {

    it('Should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" with thunk "checkAuthAction', async () => {
      const mockAuthResponse = {
        email: faker.internet.email,
        avatarUrl: faker.system.filePath,
      };

      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockAuthResponse);

      await store.dispatch(checkAuthAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);
    });

    it('Should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" with thunk "checkAuthAction',
      async () => {
        mockAxiosAdapter.onGet(APIRoute.Login).reply(400);

        await store.dispatch(checkAuthAction());
        const actions = extractActionsTypes(store.getActions());

        expect(actions).toEqual([
          checkAuthAction.pending.type,
          checkAuthAction.rejected.type,
        ]);
      });
  });

  describe('fetchOffersAction', () => {
    it('Should dispatch "fetchOffersAction.pending", "fetchOffersAction.fulfilled" when server response 200', async () => {
      const mockOffers = Array.from({ length: 120 }, makeFakeOffer);
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);
      await store.dispatch(fetchOffersAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);

      const fetchOffersActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.fulfilled.type,
      ]);

      expect(fetchOffersActionFulfilled.payload).toEqual(mockOffers);
    });

    it('Should dispatch "fetchOffersAction.pending", "fetchOffersAction.rejected" when server response 200', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400, []);
      await store.dispatch(fetchOffersAction());

      const extractedActionsTypes = extractActionsTypes(store.getActions());

      expect(extractedActionsTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type,
      ]);
    });
  });

  describe('loginAction', () => {
    it('Should dispatch "loginAction.pending", "fetchOffersAction.pending", "fetchFavoriteOffersAction.pending", "loginAction.fulfilled" when server response 200 ', async () => {
      const fakeUser: AuthData = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const fakerServerReply = { token: faker.string.alpha() };
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakerServerReply);

      await store.dispatch(loginAction(fakeUser));

      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        loginAction.pending.type,
        fetchOffersAction.pending.type,
        fetchFavoriteOffersAction.pending.type,
        loginAction.fulfilled.type
      ]);
    });

    it('Should call "saveToken" once with the received token', async () => {
      const fakeUser: AuthData = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const fakerServerReply = { token: faker.string.alpha() };
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakerServerReply);

      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(loginAction(fakeUser));

      expect(mockSaveToken).toBeCalledTimes(1);
      expect(mockSaveToken).toBeCalledWith(fakerServerReply.token);
    });
  });

  describe('logoutAction', () => {
    it('Should dispatch "logoutAction.pending", "fetchOffersAction.pending", "logoutAction.fulfilled" when server response 204', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        logoutAction.pending.type,
        fetchOffersAction.pending.type,
        logoutAction.fulfilled.type
      ]);
    });

    it('Should call "dropToken" once with "logoutAction"', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);
      const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

      await store.dispatch(logoutAction());

      expect(mockDropToken).toBeCalledTimes(1);
    });
  });
});
