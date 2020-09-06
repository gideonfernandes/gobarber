import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O campo e-mail é obrigatório'),
  password: Yup
    .string()
    .required('A senha é obrigatória'),
});

export default function SignIn() {
  function handleSubmit(data) {
    console.log(data);
  };

  return (
    <>
      <img src={logo} alt="GoBarber Logo" />

      <Form schema={schema} onSubmit={handleSubmit}>
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
        <a href="/register">Criar conta gratuita</a>
      </Form>
    </>
  )
};
