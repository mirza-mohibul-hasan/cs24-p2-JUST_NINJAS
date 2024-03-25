import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const Navbar = () => {
  const { user, providerLogout } = useContext(AuthContext);
  return (
    <div>
      <h1>Role: {user?.role}</h1>
      <button onClick={providerLogout}>Log Out</button>
    </div>
  );
};

export default Navbar;
