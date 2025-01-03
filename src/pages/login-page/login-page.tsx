import { Helmet } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';
import { FormEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector, } from '../../hooks';
import { checkAuthAction, loginAction } from '../../store/api-action';
import { useEffect } from 'react';
import { redirectToRoute } from '../../store/action';
import { getAuthStatus } from '../../store/selectors';

// #======================== LoginPage ========================# //

export default function LoginPage(): JSX.Element {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(getAuthStatus);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (loginRef.current !== null && passwordRef.current !== null) {
      dispatch(loginAction({
        login: loginRef.current.value,
        password: passwordRef.current.value
      }));
    }
  };
  useEffect(() => {
    if (authStatus === AuthorizationStatus.Auth) {
      dispatch(checkAuthAction());
      dispatch(redirectToRoute(AppRoute.Main));
    }
  }, [authStatus, dispatch]);

  return (
    <div className='page page--gray page--login'>
      <Helmet>
        <title>6 cities - login</title>
      </Helmet>

      <main className='page__main page__main--login'>
        <div className='page__login-container container'>
          <section className='login'>
            <h1 className='login__title'>Sign in</h1>
            <form className='login__form form' onSubmit={handleSubmit}>
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>E-mail</label>
                <input
                  className='login__input form__input'
                  type='email'
                  name='email'
                  placeholder='Email'
                  required
                  ref={loginRef}
                />
              </div>
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>Password</label>
                <input
                  className='login__input form__input'
                  type='password'
                  name='password'
                  placeholder='Password'
                  required
                  ref={passwordRef}
                />
              </div>
              <button
                className='login__submit form__submit button'
                type='submit'
              >
                Sign in
              </button>
            </form>
          </section>
          <section className='locations locations--login locations--current'>
            <div className='locations__item'>
              <a className='locations__item-link' href='#'>
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
