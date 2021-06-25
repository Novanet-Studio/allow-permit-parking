import React, { useEffect } from 'react';
import { useFormik } from 'formik';

import * as F from '../../../../components/Form';
import Button from '../../../../components/Button';
import useUser from '../../../../hooks/use-user';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen(): JSX.Element {
  const { login, resumeSession } = useUser();
  const formik = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values: LoginForm) => {
      await login(values.email, values.password);
    },
  });

  useEffect(() => {
    (async () => {
      await resumeSession();
    })();
  }, []);

  return (
    <section className="login">
      <header className="header header--login">
        <h1 className="header__title header__title--black">
          ESW Towing parking management system
        </h1>
        <p className="header__text">Please enter your credentials</p>
      </header>

      <main className="main main--login">
        <form
          onSubmit={formik.handleSubmit}
          className="form form--one-column form--login-mode"
        >
          <F.Group>
            <F.Label text="Email" htmlFor="email" />
            <F.Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={formik.handleBlur}
            />
            <F.Feedback text={formik.errors.email} />
          </F.Group>
          <F.Group>
            <F.Label text="Password" htmlFor="password" />
            <F.Input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={formik.handleBlur}
            />
            <F.Feedback text={formik.errors.password} />
          </F.Group>
          <F.Group>
            <Button type="submit">Login</Button>
          </F.Group>
        </form>
      </main>
    </section>
  );
}
