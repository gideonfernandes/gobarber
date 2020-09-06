import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  name: Yup
    .string('Insira um nome válido')
    .required('O campo nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O campo e-mail é obrigatório'),
  password: Yup
    .string()
    .min(6, 'É necessário no mínimo 6 caracteres')
    .required('A senha é obrigatória'),
});

export default function SignUp() {
  function handleSubmit(data) {
    console.log(data);
  };

  return (
    <>
      <img src={logo} alt="GoBarber Logo" />

      <Form schema={schema} onSubmit={handleSubmit}>
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
        <a href="/">Já tenho login</a>
      </Form>
    </>
  )
};
