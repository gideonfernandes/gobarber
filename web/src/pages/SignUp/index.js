import React from 'react';
import { Form, Input } from '@rocketseat/unform';

import logo from '~/assets/logo.svg';
import { Link } from 'react-router-dom';

export default function SignUp() {
  function handleSubmit(data) {
    console.log(data);
  };

  return (
    <>
      <img src={logo} alt="GoBarber Logo" />

      <Form onSubmit={handleSubmit}>
        <Input
          name="name"
          type="text"
          placeholder="Nome completo"
        />
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

        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  )
};
