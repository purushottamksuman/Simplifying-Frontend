import { HeartIcon, PlusIcon, SearchIcon, UsersIcon } from "lucide-react";
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
  { id: "all", emoji: "🌟", label: "All", active: true },
  { id: "coding", emoji: "💻", label: "Coding", active: false },
  { id: "technology", emoji: "⚡", label: "Technology", active: false },
  {
    id: "entrepreneurship",
    emoji: "💼",
    label: "Entrepreneurship",
    active: false,
  },
  { id: "robotics", emoji: "🤖", label: "Robotics", active: false },
  { id: "creative", emoji: "🎨", label: "Creative", active: false },
  { id: "business", emoji: "📈", label: "Business", active: false },
  { id: "science", emoji: "🔬", label: "Science", active: false },
];

const clubs = [
  {
    id: 1,
    title: "React Developers",
    category: "Coding",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: true,
  },
  {
    id: 2,
    title: "React Developers",
    category: "Coding",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: true,
  },
  {
    id: 3,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
  {
    id: 4,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
  {
    id: 5,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
  {
    id: 6,
    title: "React Developers",
    category: "Coding",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: true,
  },
  {
    id: 7,
    title: "React Developers",
    category: "Coding",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: true,
  },
  {
    id: 8,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
  {
    id: 9,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
  {
    id: 10,
    title: "Data Science",
    category: "Technology",
    members: "1,247 members",
    description:
      "A community for React enthusiasts to share knowledge, best practices, and",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=249&h=141&fit=crop",
    joined: false,
  },
];

const sidebarItems = [
  { icon: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Dashboard", active: false },
  { icon: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Profile Settings", active: false },
  { icon: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "My Course", active: false },
  { icon: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Live Classes", active: false },
  { icon: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Test & Assessment", active: false },
  { icon: "https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Certificates", active: false },
  { icon: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop", label: "Leaderboard", active: false },
  { icon: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Badges & Rewards", active: false },
  { icon: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Clubs & Community", active: true },
  { icon: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Raise a Doubt", active: false },
  { icon: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Referrals Program", active: false },
];

export const PropertyClubAndSubsection = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative w-full h-auto bg-[#3479ff]">
      <div className="relative w-full max-w-[1605px] mx-auto bg-white shadow-[0px_0px_29px_#00000075]">
        <div className="relative w-full">
          <img
            className="w-full h-[886px] object-cover"
            alt="Group"
            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1903&h=886&fit=crop"
          />

          <main className="flex flex-col w-full max-w-[1461px] items-center gap-[29px] mx-auto px-4 py-[124px]">
            <section className="flex flex-col items-start gap-[21px] w-full">
              <header className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start gap-[7px]">
                  <div className="flex flex-col items-start">
                    <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[31.5px]">
                      Clubs & Community
                    </h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomstorm-gray text-xl tracking-[0] leading-[21px]">
                      Discover and join communities that match your interests
                    </p>
                  </div>
                </div>

                <Button className="w-[230px] h-[49px] bg-[#155cfb] hover:bg-[#155cfb]/90 rounded-[6.75px] h-auto">
                  <PlusIcon className="w-6 h-6 mr-2" />
                  <span className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-[17px] text-center tracking-[0] leading-[17.5px]">
                    Create Club
                  </span>
                </Button>
              </header>

              <div className="flex items-center justify-center gap-3.5 w-full">
                <div className="flex flex-col items-start flex-1">
                  <div className="w-full flex items-start justify-center gap-3">
                    <div className="flex items-center justify-center gap-2.5 px-4 py-5 flex-1 bg-white rounded-xl border border-solid border-[#cccccccc]">
                      <SearchIcon className="w-4 h-4 text-[#9e9e9e]" />
                      <Input
                        className="flex-1 border-0 p-0 [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs focus-visible:ring-0"
                        placeholder="SearchIcon your class here...."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Select defaultValue="most-members">
                  <SelectTrigger className="w-[174px] h-[43px] bg-wwwfigmacomathens-gray rounded-[6.75px] border-0">
                    <div className="flex items-center gap-[13.5px]">
                      <img
                        className="w-[21px] h-3.5"
                        alt="Svg margin"
                        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=21&h=14&fit=crop"
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-members">
                      <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomcod-gray text-[12.3px]">
                        Most Members
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-[10.5px] w-full overflow-x-auto pb-[7px]">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={category.active ? "default" : "secondary"}
                    className={`flex items-center gap-0.5 px-[15.6px] py-[7.6px] h-[31px] rounded-[53687100px] border border-solid whitespace-nowrap ${
                      category.active
                        ? "bg-[#3479ff] text-white shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]"
                        : "bg-[#d0e0ff] text-neutral-950 border-[#0000001a]"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="[font-family:'Segoe_UI_Emoji-Regular',Helvetica] font-normal text-[12.3px] text-center tracking-[0] leading-8">
                      {category.emoji}
                    </span>
                    <span className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[12.3px] text-center tracking-[0] leading-[11px]">
                      {category.label}
                    </span>
                  </Button>
                ))}
              </div>
            </section>

            <section className="flex flex-col items-start gap-10 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[19px] w-full">
                {clubs.slice(0, 5).map((club) => (
                  <Card
                    key={club.id}
                    className="w-full max-w-[277px] h-[357px] shadow-cards-long-default bg-white rounded-[20px] relative"
                  >
                    <CardContent className="flex flex-col items-start justify-center gap-2.5 p-3 h-full">
                      <img
                        className="h-[141px] w-full object-cover rounded-lg"
                        alt="Club"
                        src={club.image}
                      />

                      <div className="flex flex-col items-start justify-center gap-[5px]">
                        <Badge
                          className={`${
                            club.category === "Coding" ? "w-[65px]" : "w-[79px]"
                          } h-[21px] justify-center gap-0.5 px-1 py-3 bg-[#007fff4c] rounded-[25px] border-0`}
                        >
                          <span className="[font-family:'Inter',Helvetica] font-semibold text-[#13377c] text-[8px] tracking-[0] leading-[normal]">
                            {club.category}
                          </span>
                        </Badge>

                        <div className="flex flex-col w-[249px] h-[52px] items-start gap-[2.5px]">
                          <div className="flex flex-col items-start w-full">
                            <h3 className="font-www-figma-com-semantic-heading-3 text-wwwfigmacomcod-gray text-[length:var(--www-figma-com-semantic-heading-3-font-size)] leading-[var(--www-figma-com-semantic-heading-3-line-height)] font-[number:var(--www-figma-com-semantic-heading-3-font-weight)] tracking-[var(--www-figma-com-semantic-heading-3-letter-spacing)] [font-style:var(--www-figma-com-semantic-heading-3-font-style)]">
                              {club.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-[3.5px] w-full">
                            <UsersIcon className="w-3.5 h-3.5 text-wwwfigmacomstorm-gray" />
                            <div className="flex flex-col items-start">
                              <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomstorm-gray text-[12.3px] tracking-[0] leading-[17.5px]">
                                {club.members}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col w-[249px] h-[45px] items-start">
                        <p className="font-www-figma-com-segoe-UI-regular font-[number:var(--www-figma-com-segoe-UI-regular-font-weight)] text-wwwfigmacomstorm-gray text-[length:var(--www-figma-com-segoe-UI-regular-font-size)] tracking-[var(--www-figma-com-segoe-UI-regular-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-regular-line-height)] [font-style:var(--www-figma-com-segoe-UI-regular-font-style)]">
                          {club.description}
                          <br />
                          share knowledge, best practices, and
                        </p>
                      </div>

                      {club.joined ? (
                        <Button className="w-[249px] h-[26px] bg-wwwfigmacomfeta hover:bg-wwwfigmacomfeta/90 rounded-[6.75px] border border-solid border-[#b8f7cf] h-auto">
                          <img
                            className="w-[13px] h-3.5 mr-[5px]"
                            alt="Frame"
                            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=13&h=14&fit=crop"
                          />
                          <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-wwwfigmacomfun-green text-[length:var(--www-figma-com-semantic-button-font-size)] text-center tracking-[var(--www-figma-com-semantic-button-letter-spacing)] leading-[var(--www-figma-com-semantic-button-line-height)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                            Joined
                          </span>
                        </Button>
                      ) : (
                        <Button className="w-[249px] h-[26px] bg-wwwfigmacomblue-ribbon hover:bg-wwwfigmacomblue-ribbon/90 rounded-[6.75px] h-auto">
                          <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-wwwfigmacomwhite text-[length:var(--www-figma-com-semantic-button-font-size)] text-center leading-[var(--www-figma-com-semantic-button-line-height)] tracking-[var(--www-figma-com-semantic-button-letter-spacing)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                            Join Club
                          </span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 w-5 h-5 bg-[#cccccc80] hover:bg-[#cccccc60] rounded-[50px] backdrop-blur-[3.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(3.5px)_brightness(100%)] p-1.5"
                      >
                        <HeartIcon className="w-full h-full" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[19px] w-full">
                {clubs.slice(5, 10).map((club) => (
                  <Card
                    key={club.id}
                    className="w-full max-w-[277px] h-[357px] shadow-cards-long-default bg-white rounded-[20px] relative"
                  >
                    <CardContent className="flex flex-col items-start justify-center gap-2.5 p-3 h-full">
                      <img
                        className="h-[141px] w-full object-cover rounded-lg"
                        alt="Club"
                        src={club.image}
                      />

                      <div className="flex flex-col items-start justify-center gap-[5px]">
                        <Badge
                          className={`${
                            club.category === "Coding" ? "w-[65px]" : "w-[79px]"
                          } h-[21px] justify-center gap-0.5 px-1 py-3 bg-[#007fff4c] rounded-[25px] border-0`}
                        >
                          <span className="[font-family:'Inter',Helvetica] font-semibold text-[#13377c] text-[8px] tracking-[0] leading-[normal]">
                            {club.category}
                          </span>
                        </Badge>

                        <div className="flex flex-col w-[249px] h-[52px] items-start gap-[2.5px]">
                          <div className="flex flex-col items-start w-full">
                            <h3 className="font-www-figma-com-semantic-heading-3 text-wwwfigmacomcod-gray text-[length:var(--www-figma-com-semantic-heading-3-font-size)] leading-[var(--www-figma-com-semantic-heading-3-line-height)] font-[number:var(--www-figma-com-semantic-heading-3-font-weight)] tracking-[var(--www-figma-com-semantic-heading-3-letter-spacing)] [font-style:var(--www-figma-com-semantic-heading-3-font-style)]">
                              {club.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-[3.5px] w-full">
                            <UsersIcon className="w-3.5 h-3.5 text-wwwfigmacomstorm-gray" />
                            <div className="flex flex-col items-start">
                              <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomstorm-gray text-[12.3px] tracking-[0] leading-[17.5px]">
                                {club.members}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col w-[249px] h-[45px] items-start">
                        <p className="font-www-figma-com-segoe-UI-regular font-[number:var(--www-figma-com-segoe-UI-regular-font-weight)] text-wwwfigmacomstorm-gray text-[length:var(--www-figma-com-segoe-UI-regular-font-size)] tracking-[var(--www-figma-com-segoe-UI-regular-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-regular-line-height)] [font-style:var(--www-figma-com-segoe-UI-regular-font-style)]">
                          {club.description}
                          <br />
                          share knowledge, best practices, and
                        </p>
                      </div>

                      {club.joined ? (
                        <Button className="w-[249px] h-[26px] bg-wwwfigmacomfeta hover:bg-wwwfigmacomfeta/90 rounded-[6.75px] border border-solid border-[#b8f7cf] h-auto">
                          <img
                            className="w-[13px] h-3.5 mr-[5px]"
                            alt="Frame"
                            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=13&h=14&fit=crop"
                          />
                          <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-wwwfigmacomfun-green text-[length:var(--www-figma-com-semantic-button-font-size)] text-center tracking-[var(--www-figma-com-semantic-button-letter-spacing)] leading-[var(--www-figma-com-semantic-button-line-height)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                            Joined
                          </span>
                        </Button>
                      ) : (
                        <Button className="w-[249px] h-[26px] bg-wwwfigmacomblue-ribbon hover:bg-wwwfigmacomblue-ribbon/90 rounded-[6.75px] h-auto">
                          <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-wwwfigmacomwhite text-[length:var(--www-figma-com-semantic-button-font-size)] text-center leading-[var(--www-figma-com-semantic-button-line-height)] tracking-[var(--www-figma-com-semantic-button-letter-spacing)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                            Join Club
                          </span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 w-5 h-5 bg-[#cccccc80] hover:bg-[#cccccc60] rounded-[50px] backdrop-blur-[3.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(3.5px)_brightness(100%)] p-1.5"
                      >
                        <HeartIcon className="w-full h-full" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </main>

          <nav className="absolute top-0 left-[349px] flex w-[1503px] items-center justify-between px-8 py-0">
            <div className="flex items-center justify-center gap-[57px]">
              <img
                className="w-[25px] h-[25px]"
                alt="Component"
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=25&h=25&fit=crop"
              />
              <div className="w-[76px] h-[25px]">
                <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                  Club & Community
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="h-6">
                  <div className="relative w-[17px] h-5 top-0.5 left-1 bg-[100%_100%]" />
                </div>
              </div>
              <div className="w-14 h-14 bg-cover bg-[50%_50%]">
                <div className="h-14 rounded-[28px] border-4 border-solid border-[#3479ff99]" />
              </div>
              <img
                className="w-6 h-6"
                alt="Iconly light outline"
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop"
              />
            </div>
          </nav>
        </div>
      </div>

      <img
        className="absolute w-[262px] h-[68px] top-[35px] left-[19px]"
        alt="Frame"
        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=262&h=68&fit=crop"
      />

      <aside className="flex flex-col items-start gap-[90px] absolute top-[137px] left-[59px]">
        <nav className="flex flex-col items-start gap-[43px] w-full">
          {sidebarItems.map((item, index) => (
            <div key={index} className="flex items-center gap-[17px] w-full">
              <img
                className="w-[26px] h-[26px]"
                alt={item.label}
                src={item.icon}
              />
              <span
                className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap ${
                  item.active ? "text-[#13377c]" : "text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <img
            className="w-7 h-7"
            alt="Sign out"
            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=28&h=28&fit=crop"
          />
          <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </span>
        </div>
      </aside>
    </div>
  );
};