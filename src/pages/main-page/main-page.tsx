import { Helmet } from 'react-helmet-async';
import { PlaceCardType } from '../../types/place-card-type';

// %------------ components ------------% //
import MainOffers from '../../components/main-offers/main-offers';
import Map from '../../components/map/map';
import Navigation from '../../components/navigation/navigation';

// #======================== MainPage ========================# //

type MainPageProps = {
  offers: PlaceCardType[];
};

export default function MainPage(mainPageProps: MainPageProps): JSX.Element {
  const { offers } = mainPageProps;
  return (
    <div className='page page--gray page--main'>
      <Helmet>
        <title>6 cities</title>
      </Helmet>

      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>

        <Navigation />

        <div className='cities'>
          <div className='cities__places-container container'>

            <MainOffers offers={offers} />

            <div className='cities__right-section'>
              <Map />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
