import React, { useState } from 'react';
import { supabase } from '@/services/supabase';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName } // Supabase armazena isso em user.user_metadata
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else if (data.user) {
      // Opcional: Inserir no `customers` aqui também se houver mais dados além da role padrão
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          id: data.user.id, // Usar o ID do auth.users
          full_name: fullName,
          email: email,
          auth_user_id: data.user.id // Link para o auth.users.id
        });

      if (insertError) {
        console.error('Erro ao criar perfil de cliente:', insertError);
        alert('Erro ao registrar. Tente novamente.');
        setLoading(false);
        return;
      }

      alert('Verifique seu e-mail para confirmar o registro!');
      navigate('/auth/login');
    }
  };

  return (
    <div className="auth-container">
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} style={{ background: 'var(--color-primary)' }}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>
      <p>Já tem uma conta? <Link to="/auth/login">Faça login</Link></p>
    </div>
  );
};

export default RegisterPage;