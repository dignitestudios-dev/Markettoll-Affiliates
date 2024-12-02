import React, { createContext, useState } from "react";

export const SearchedProductContext = createContext();

const SearchedProductProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchedProductContext.Provider
      value={{ searchQuery, setSearchQuery, searchResults, setSearchResults }}
    >
      {children}
    </SearchedProductContext.Provider>
  );
};

export default SearchedProductProvider;
