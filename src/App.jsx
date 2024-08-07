import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Products from "./components/Products/Products";
import Update from "./components/Update/Update";
import AddProduct from "./components/AddProduct/AddProduct";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Orders from "./components/Orders/Orders";
import Announcement from "./components/Announcement/Announcement";
import Processing from "./components/Processing/Processing";
import Message from "./components/Message/Message";



function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/products" element={<Products />} />
            <Route path="/update/:id" element={<Update/>} />
            <Route path="/addproduct" element={<AddProduct/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/announcement" element={<Announcement/>} />
            <Route path="/processing/:id" element={<Processing/>} />
            <Route path="/message" element={<Message/>} />
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      </Router>
    </>
  );
}

export default App;
