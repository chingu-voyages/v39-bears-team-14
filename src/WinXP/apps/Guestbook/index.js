import { useState } from "react";
import "xp.css/dist/XP.css";

function App() {
  const [isMessages, setIsMessages] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Set IsMessages value as true and other states' false
  const handleIsMessages = () => {
    if (isMessages !== true) {
      setIsMessages((current) => !current);
    }
    if (isSignup === true) {
      setIsSignup((current) => !current);
    }
    if (isLogin === true) {
      setIsLogin((current) => !current);
    }
  };

  // Set IsSignup value as true and other states' false
  const handleIsSignUp = () => {
    if (isSignup !== true) {
      setIsSignup((current) => !current);
    }
    if (isMessages === true) {
      setIsMessages((current) => !current);
    }
    if (isLogin === true) {
      setIsLogin((current) => !current);
    }
  };

  // Set IsLogin value as true and other states' false
  const handleIsLogin = () => {
    if (isLogin !== true) {
      setIsLogin((current) => !current);
    }
    if (isMessages === true) {
      setIsMessages((current) => !current);
    }
    if (isSignup === true) {
      setIsSignup((current) => !current);
    }
  };

  return (
    <section className="window" style={{ width: 400 }}>
      <div className="title-bar">
        <div className="title-bar-text">Guestbook</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <section className="window-body">
        <menu role="tablist">
          <button onClick={handleIsMessages} aria-controls="messages">
            Messages
          </button>
          <button onClick={handleIsSignUp} aria-controls="signup">
            Sign Up
          </button>
          <button onClick={handleIsLogin} aria-controls="login">
            Login
          </button>
        </menu>

        {/* Show content on Messages tab */}
        {isMessages ? (
          <article role="tabpanel" id="messages">
            <form
              className="field-row-stacked"
              style={{ width: 350, display: "flex", justifyContent: "center" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="message">
                Your Message
              </label>
              <textarea
                style={{ backgroundColor: "#ece9d8" }}
                id="message"
                rows="8"
              ></textarea>

              <button style={{ height: 30, fontWeight: "bold" }}>
                Post Now
              </button>
            </form>
            <article>
              <p style={{ fontWeight: "bold" }}>Messages</p>
            </article>
          </article>
        ) : null}

        {/* Show content on Signup tab */}
        {isSignup ? (
          <article role="tabpanel" id="signup">
            <form
              className="field-row-stacked"
              style={{ width: 350, display: "flex", justifyContent: "center" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="name">
                Name
              </label>
              <input id="name" rows="8"></input>

              <label style={{ fontWeight: "bold" }} htmlFor="username">
                Username
              </label>
              <input id="username" rows="8"></input>

              <label style={{ fontWeight: "bold" }} htmlFor="password">
                Password
              </label>
              <input id="password" rows="8"></input>

              <label style={{ fontWeight: "bold" }} htmlFor="twitter-handle">
                Twitter handle
              </label>
              <input id="twitter-handle" rows="8"></input>
              <button
                style={{ height: 30, fontWeight: "bold" }}
              >
                Sign Up
              </button>
            </form>
          </article>
        ) : null}

        {/* Show content on Login tab */}
        {isLogin ? (
          <article role="tabpanel" id="login">
            <form
              className="field-row-stacked"
              style={{ width: 350, display: "flex", justifyContent: "center" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="username">
                Username
              </label>
              <input id="username" rows="8"></input>

              <label style={{ fontWeight: "bold" }} htmlFor="password">
                Password
              </label>
              <input id="password" rows="8"></input>

              <button style={{ height: 30, fontWeight: "bold" }}>Login</button>

              <button style={{ height: 30, fontWeight: "bold" }}>Logout</button>
            </form>
          </article>
        ) : null}
      </section>
    </section>
  );
}

export default App;
