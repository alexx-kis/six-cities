import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import BookmarkButton from '../../components/bookmark-button/bookmark-button';
import Map from '../../components/map/map';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferHeader from '../../components/offer-header/offer-header';
import OfferHost from '../../components/offer-host/offer-host';
import OfferInside from '../../components/offer-inside/offer-inside';
import PlacesList from '../../components/places-list/places-list';
import Preloader from '../../components/preloader/preloader';
import Reviews from '../../components/reviews/reviews';
import { AppRoute, DataStatus, NEAR_PLACES_AMOUNT } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useScrollToTop from '../../hooks/use-scroll-to-top/use-scroll-to-top';
import { fetchNearPlacesAction, fetchOfferAction, fetchReviewsAction } from '../../store/api-action';
import { getNearPlaces } from '../../store/near-places-process/near-places-process.selectors';
import { getOfferData, getOfferStatus } from '../../store/offer-process/offer-process.selectors';
import { getReviews } from '../../store/reviews-process/reviews-process.selectors';

// #======================== OfferPage ========================# //

export default function OfferPage(): JSX.Element {
  useScrollToTop();
  const offerData = useAppSelector(getOfferData);
  const offerStatus = useAppSelector(getOfferStatus);
  const nearPlaces = useAppSelector(getNearPlaces).slice(0, NEAR_PLACES_AMOUNT);
  const reviews = useAppSelector(getReviews);

  const dispatch = useAppDispatch();

  const { id } = useParams<{
    id: string;
  }>();

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && offerStatus === DataStatus.Loaded) {
      dispatch(fetchNearPlacesAction(id));
      dispatch(fetchReviewsAction(id));
    }

  }, [id, dispatch, offerStatus]);

  if (!offerData) {
    if (offerStatus === DataStatus.Error) {
      return <Navigate to={AppRoute.NotFound} />;
    }
    return <Preloader />;
  }

  const { city, title, images, rating, type, bedrooms, maxAdults, goods, price, isFavorite, description,
    host: { name, isPro, avatarUrl }, isPremium
  } = offerData;

  const offerHeaderData = { title, rating, type, maxAdults, bedrooms, price, isPremium };
  const offerHostData = { name, isPro, avatarUrl, description };

  return (
    <main className='page__main page__main--offer' data-testid='offer-page-element'>
      <Helmet>
        <title>6 cities - {title}</title>
      </Helmet>
      <section className='offer'>

        <OfferGallery images={images} />

        <div className='offer__container container' >
          <div className='offer__wrapper'>

            <OfferHeader offerHeaderData={offerHeaderData} />

            <BookmarkButton
              elementClass='offer__bookmark'
              sizes={{ width: 31, height: 33 }}
              isFavorite={isFavorite}
              offerId={id as string}
            />

            <OfferInside goods={goods} />

            <OfferHost offerHostData={offerHostData} />

            <Reviews reviews={reviews} />
          </div>
        </div>

        {nearPlaces.length !== 0 && <Map cityLocation={city.location} offers={nearPlaces} currentOffer={offerData} />}

      </section>

      <div className='container'>
        <section className='near-places places'>
          <h2 className='near-places__title'>
            Other places in the neighborhood
          </h2>
          <PlacesList offers={nearPlaces} />
        </section>
      </div>
    </main>
  );
}
