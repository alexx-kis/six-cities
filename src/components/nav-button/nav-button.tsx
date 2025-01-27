import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCityName } from '../../store/offers-process/offers-process.selectors';
import { changeCity } from '../../store/offers-process/offers-process.slice';
import { MouseEvent } from 'react';

// ^======================== NavButton ========================^ //

type NavButtonProps = {
  cityName: string;
};

export default function NavButton(navButtonProps: NavButtonProps): JSX.Element {
  const { cityName } = navButtonProps;

  const dispatch = useAppDispatch();
  const currentCityName = useAppSelector(getCityName);

  const handleNavLinkClick = (evt: MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    dispatch(changeCity(cityName));
  };

  return (
    <li className='locations__item'>
      <a
        onClick={handleNavLinkClick}
        className={classNames(
          'locations__item-link', 'tabs__item',
          { 'tabs__item--active': currentCityName === cityName }
        )}
        data-testid={`nav-button-element-${cityName}`}
      >
        <span>{cityName}</span>
      </a>
    </li>
  );
}
