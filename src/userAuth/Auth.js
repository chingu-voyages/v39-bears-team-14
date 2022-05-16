import { useState } from 'react';

import { supabase } from './supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">WinXP</h1>
        <p className="description">
          {signingUp
            ? `Sign up with your email below`
            : `Sign in with your email below`}
        </p>
        {loading ? (
          signingUp ? (
            `Sending email confirmation link...`
          ) : (
            `Signing In...`
          )
        ) : (
          <form onSubmit={signingUp ? handleSignUp : handleSignIn}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              {signingUp ? `Sign Up` : `Sign In`}
            </button>
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
            <p>
              {!signingUp && (
                <span
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={async () => {
                    await supabase.auth.api.resetPasswordForEmail(email);
                  }}
                >
                  Forgot password?
                </span>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
