import { useContext, useState } from 'react';
import React from 'react';

import styled from '@emotion/styled';
import { SessionContext } from 'App';
import { supabase } from 'supabaseClient';
// import 'xp.css/dist/XP.css';

export default function Guestbook() {
  const [session] = useContext(SessionContext);
  const [, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const [tab, setTab] = useState('auth'); // "auth" or "changePassword" or "forgotPassword"
  const [signingUp, setSigningUp] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        throw error;
      } else {
        alert(`Magic link sent to ${email}`);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      alert('passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.update({
        password: newPassword,
      });
      if (error) {
        throw error;
      } else {
        alert('password changed successfully');
        setNewPassword('');
        setNewPassword2('');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      {!session ? (
        tab === 'forgotPassword' ? (
          <>
            <h3>Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div>
                <label style={{ fontWeight: 'bold' }} htmlFor="email">
                  Email
                </label>
              </div>
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button>Get Magic Link</button>
            </form>
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setTab('auth')}
            >
              Back to Login
            </span>
          </>
        ) : tab === 'auth' ? (
          <>
            <h3>{signingUp ? 'Sign Up' : 'Log In'}</h3>
            <form onSubmit={signingUp ? handleSignUp : handleSignIn}>
              <div>
                <label style={{ fontWeight: 'bold' }} htmlFor="email">
                  Email
                </label>
              </div>
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold' }} htmlFor="password">
                  Password
                </label>
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button>{signingUp ? `Sign Up` : `Sign In`}</button>
              <p>
                {signingUp
                  ? `Already have an account?`
                  : `Don't have an account yet?`}{' '}
                <span
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setSigningUp(signingUp ? false : true)}
                >
                  {signingUp ? `Log In` : `Sign Up`}
                </span>
              </p>
              {!signingUp && (
                <p>
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => setTab('forgotPassword')}
                  >
                    Forgot Password?
                  </span>
                </p>
              )}
            </form>
          </>
        ) : (
          <></>
        )
      ) : (
        <>
          <h3>{session && 'Logged in as ' + session.user.email}</h3>
          <form onSubmit={handleChangePassword}>
            <div>
              <label style={{ fontWeight: 'bold' }} htmlFor="password">
                Change Password
              </label>
            </div>
            <div>
              <input
                id="newPassword"
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="newPassword2"
                type="password"
                placeholder="Confirm Password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
              />
            </div>
            <button>Change Password</button>
          </form>
          <button type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </>
      )}
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
