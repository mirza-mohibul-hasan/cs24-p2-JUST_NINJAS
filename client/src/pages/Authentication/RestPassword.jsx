const RestPassword = () => {
  const handleReset = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    console.log(email);
  };
  return (
    <div className="container">
      <div className="auth-container">
        <h1>Reset</h1>
        <form onSubmit={handleReset} className="auth-form">
          <input
            type="text"
            id="email"
            placeholder="Email"
            className="input-field"
          />
          <input type="submit" value="Login" className="submit-btn" />
        </form>
      </div>
    </div>
  );
};

export default RestPassword;
