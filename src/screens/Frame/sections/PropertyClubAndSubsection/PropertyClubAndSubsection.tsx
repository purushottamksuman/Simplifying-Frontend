"use client";

import { Heart, Plus, Search, Users } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const categories = [
  { id: "all", label: "All" },
  { id: "coding", label: "Coding" },
  { id: "technology", label: "Technology" },
  { id: "entrepreneurship", label: "Entrepreneurship" },
  { id: "robotics", label: "Robotics" },
  { id: "creative", label: "Creative" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
];

const clubs = [
  {
    id: 1,
    title: "React Developers",
    category: "Coding",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and learn together.",
    image:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    joined: true,
  },
  {
    id: 2,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A place to discuss ML, AI, big data, and more with like-minded data science enthusiasts.",
    image:
      "https://images.pexels.com/photos/3184635/pexels-photo-3184635.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    joined: false,
  },
  {
    id: 3,
    title: "Entrepreneurs Hub",
    category: "Entrepreneurship",
    members: "980 members",
    description:
      "Join aspiring entrepreneurs and exchange ideas on building startups and scaling businesses.",
    image:
      "https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    joined: false,
  },
  {
    id: 4,
    title: "Robotics Innovators",
    category: "Robotics",
    members: "643 members",
    description:
      "Explore cutting-edge robotics and collaborate with innovators from around the globe.",
    image:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    joined: false,
  },
  {
    id: 5,
    title: "Creative Minds",
    category: "Creative",
    members: "1,150 members",
    description:
      "A vibrant community of designers, writers, and creative thinkers sharing inspiration daily.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    joined: true,
  },
];

export function PropertyClubAndSubsection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const filteredClubs = clubs.filter(
    (club) =>
      (activeCategory === "all" ||
        club.category.toLowerCase() === activeCategory) &&
      club.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex-1 p-10 bg-[#f9fbff] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#13377c]">
            Clubs & Community
          </h1>
          <p className="text-gray-500 text-base">
            Discover and join communities that match your interests
          </p>
        </div>
        <Button className="bg-[#155cfb] hover:bg-[#0e4bd1] text-white flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium shadow-md">
          <Plus size={18} />
          Create Club
        </Button>
      </header>

      {/* Search + Sort */}
      <div className="flex items-center justify-between gap-6 mb-8 flex-wrap">
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border shadow-sm w-[600px]">
          <Search size={18} className="text-gray-400" />
          <Input
            className="border-0 focus:ring-0 text-gray-700"
            placeholder="Search your class here..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Select defaultValue="most-members">
          <SelectTrigger className="w-44 bg-gray-100 border rounded-lg">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-members">Most Members</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all duration-200 ${
              activeCategory === category.id
                ? "bg-[#3479ff] text-white shadow-md"
                : "bg-[#e7f0ff] text-gray-700 hover:bg-[#d6e6ff]"
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClubs.map((club) => (
          <Card
            key={club.id}
            className="shadow-lg rounded-2xl overflow-hidden relative hover:shadow-2xl transition-shadow duration-300"
          >
            <CardContent className="p-4 flex flex-col gap-3">
              {/* Club Image */}
              <div className="relative">
                <img
                  src={club.image}
                  alt={club.title}
                  className="h-36 w-full object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full shadow-md"
                >
                  <Heart size={16} className="text-gray-500" />
                </Button>
              </div>

              {/* Club Info */}
              <Badge className="bg-blue-100 text-[#13377c] w-fit px-3 py-1 rounded-full text-xs font-medium">
                {club.category}
              </Badge>
              <h3 className="text-lg font-semibold">{club.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Users size={16} /> {club.members}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {club.description}
              </p>

              {/* Join Button */}
              {club.joined ? (
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 bg-green-50 hover:bg-green-100 w-full rounded-lg font-medium"
                >
                  ✓ Joined
                </Button>
              ) : (
                <Button className="bg-[#155cfb] hover:bg-[#0e4bd1] text-white w-full rounded-lg font-medium shadow-md">
                  Join Club
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
