import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';

// %------------ mocks ------------% //
import { OFFERS } from '../../mock/offers';
import { NEAR_PLACES } from '../../mock/near-places';
import { FAVORITE_OFFERS } from '../../mock/favorite-offers';
import { REVIEWS } from '../../mock/reviews';

// %------------ components ------------% //
import PrivateRoute from '../private-route/private-route';
import Layout from '../layout/layout';
import ScrollToTop from '../scroll-to-top/scroll-to-top';
import MainPage from '../../pages/main-page/main-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import LoginPage from '../../pages/login-page/login-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';

// ^======================== App ========================^ //

export default function App(): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<MainPage offers={OFFERS} />} />
            <Route
              path={AppRoute.Offer}
              element={
                <OfferPage
                  nearPlaces={NEAR_PLACES}
                  reviews={REVIEWS}
                />
              }
            />
            <Route
              path={AppRoute.Favorites}
              element={
                <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
                  <FavoritesPage favoriteOffers={FAVORITE_OFFERS} />
                </PrivateRoute>
              }
            />
            <Route path={AppRoute.Login} element={<LoginPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </HelmetProvider >
  );
}
