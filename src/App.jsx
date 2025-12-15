import { createContext, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AnimatedRoutes from "./animatedRoutes/AnimatedRoutes";

import { BrowserRouter as Router } from "react-router-dom";

export const currentReadingContext = createContext();
export const favoriteBooksContext = createContext();
export const toReadBooksContext = createContext();
export const haveReadBooksContext = createContext();

export const getLocalStorage = name => {
  try {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`[App] Failed to parse localStorage item "${name}":`, error);
    return [];
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [currentReadingBooks, setCurrentReadingBooks] = useState(() =>
    getLocalStorage("current reading books")
  );
  const [favoriteBooks, setFavoriteBooks] = useState(() => getLocalStorage("favorite books"));
  const [toReadBooks, setToReadBooks] = useState(() => getLocalStorage("to read books"));
  const [haveReadBooks, setHaveReadBooks] = useState(() => getLocalStorage("have read books"));

  const providers = [
    [currentReadingContext, { currentReadingBooks, setCurrentReadingBooks }],
    [favoriteBooksContext, { favoriteBooks, setFavoriteBooks }],
    [toReadBooksContext, { toReadBooks, setToReadBooks }],
    [haveReadBooksContext, { haveReadBooks, setHaveReadBooks }],
  ];

  return (
    <Router>
      <div className="App">
        {providers.reduceRight(
          (children, [Context, value]) => (
            <Context.Provider value={value}>{children}</Context.Provider>
          ),
          <>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <AnimatedRoutes darkMode={darkMode} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
