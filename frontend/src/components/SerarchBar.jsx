import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { RiSearch2Line } from "react-icons/ri";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        navigate(`/collection?search=${encodeURIComponent(search)}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, navigate]);

  useEffect(() => {
    if (location.pathname !== "/collection") setSearch("");
  }, [location.pathname]);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center px-2 py-2 my-2 mx-5 border rounded-md bg-white">
        <span className="w-4">
          <RiSearch2Line size={25} className="text-gray-400" />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="جستجو در پوشکان ..."
          className="w-full outline-none bg-inherit mr-2"
          aria-label="جستجو"
        />
      </div>
    </div>
  );
};

export default SearchBar;
