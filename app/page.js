"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  setFilteredParts,
  setPostalCode,
  refreshAllParts,
} from "./redux/features/partsSlice";
import Link from "next/link";
import { Plus, ListIcon, Search } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const dispatch = useDispatch();
  const { allParts, filteredParts, postalCode } = useSelector(
    (state) => state.parts
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Refresh and initialize filtered parts on load
  useEffect(() => {
    // First refresh to make sure we have the latest combined data
    dispatch(refreshAllParts());
    // Then set filtered parts based on current filter
    const applyCurrentFilter = () => {
      let filtered = [...allParts];

      switch (filter) {
        case "low-to-high":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "high-to-low":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "ev-only":
          filtered = filtered.filter((part) => part.category === "EV Parts");
          break;
        default:
          // Keep random order
          break;
      }

      dispatch(setFilteredParts(filtered));
    };

    applyCurrentFilter();
  }, [dispatch, allParts.length, filter]);

  const handleSearch = () => {
    const filtered = allParts.filter((part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setFilteredParts(filtered));
    setDisplayedItems(ITEMS_PER_PAGE);
  };

  const handleFilter = (value) => {
    setFilter(value);
    let filtered = [...allParts];

    switch (value) {
      case "low-to-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "ev-only":
        filtered = filtered.filter((part) => part.category === "EV Parts");
        break;
      default:
        break;
    }

    dispatch(setFilteredParts(filtered));
  };

  const getFilterTitle = () => {
    switch (filter) {
      case "low-to-high":
        return "Parts (Price: Low to High)";
      case "high-to-low":
        return "Parts (Price: High to Low)";
      case "ev-only":
        return "EV Parts";
      default:
        return "All Parts";
    }
  };

  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50" />
      </div>

      <div className="flex justify-end gap-4 mb-8">
        <Link href="/add-part">
          <Button
            variant="outline"
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </Button>
        </Link>
        <Link href="/my-listings">
          <Button
            variant="outline"
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <ListIcon className="w-4 h-4 mr-2" />
            My Listings
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white animate-fade-in">
          Car Parts Marketplace
        </h1>
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search for parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => dispatch(setPostalCode(e.target.value))}
            className="w-32"
          />
          <Button
            onClick={handleSearch}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {getFilterTitle()}
          </h2>
          <Select value={filter} onValueChange={handleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parts</SelectItem>
              <SelectItem value="low-to-high">Price: Low to High</SelectItem>
              <SelectItem value="high-to-low">Price: High to Low</SelectItem>
              <SelectItem value="ev-only">EV Parts Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <Link href={`/parts/${part.id}`} key={part.id}>
              <Card className="hover:shadow-lg transition-all duration-300 h-[380px] hover:scale-[1.02] cursor-pointer bg-white/80 backdrop-blur-sm">
                <CardHeader className="">
                  <CardTitle className="text-lg flex flex-col">
                    <span className="truncate w-64">{part.name}</span>
                    <span className="text-xl font-bold">${part.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {part.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold w-36 truncate">
                      {part.seller.name}
                    </span>
                    {part.seller.isVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
