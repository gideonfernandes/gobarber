import React from 'react';

import logo from '~/assets/logo.svg';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <>
      <img src={logo} alt="GoBarber Logo" />

      <form>
        <input type="text" placeholder="Nome completo" />
        <input type="email" placeholder="Seu email" />
        <input type="password" placeholder="Sua senha secreta" />

        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </form>
    </>
  )
};
