import React from 'react';
import { Form, Input } from '@rocketseat/unform';

import logo from '~/assets/logo.svg';
import { Link } from 'react-router-dom';

export default function SignIn() {
  function handleSubmit(data) {
    console.log(data);
  };

  return (
    <>
      <img src={logo} alt="GoBarber Logo" />

      <Form onSubmit={handleSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Seu email"
        />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">Acessar</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  )
};
