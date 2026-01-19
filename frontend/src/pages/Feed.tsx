import React, { useState, useMemo, useEffect } from "react";
import ItemCard from "../сomponents/ItemCard";
import SortDropdown from "../components/SortDropdown";
import { useLocation } from "react-router-dom";
import { publicationsApi, type Publication } from "../api/publicationsApi";
import { Spin } from "antd";

const Feed = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"date" | "exchange">("date");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");

    if (query) {
      setSearchQuery(query);
      setIsSearchActive(true);
    } else {
      setSearchQuery("");
      setIsSearchActive(false);
    }
  }, [location.search]);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await publicationsApi.getAll();
      setPublications(data);
    } catch (error) {
      console.error("Ошибка при загрузке публикаций:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPublications = useMemo(() => {
    let filtered = publications;

    if (isSearchActive && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pub) =>
          pub.name.toLowerCase().includes(query) ||
          pub.description.toLowerCase().includes(query)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortOption === "date") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        const aIsFree = parseFloat(a.price) === 0;
        const bIsFree = parseFloat(b.price) === 0;
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

    return filtered;
  }, [publications, searchQuery, sortOption, isSearchActive]);

  const handleSortChange = (option: "date" | "exchange") => {
    setSortOption(option);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mt-4 sm:mt-[2rem] mx-0 sm:mx-2 md:mx-4 lg:mx-[3rem] min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <h1 className="font-inter font-semibold text-xl sm:text-2xl text-gray-900">
            {isSearchActive && searchQuery ? "Результаты поиска" : "Для Вас"}
          </h1>

          <SortDropdown
            onSortChange={handleSortChange}
            isVisible={isSearchActive && searchQuery.trim() !== ""}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div
              className="
              grid 
              grid-cols-1 
              xs:grid-cols-2 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-4 sm:gap-6
              overflow-y-auto
            "
            >
              {filteredAndSortedPublications.map((pub) => {
                // Определяем тип для изображений
                type ImageType = string | { image: string };

                // Безопасно извлекаем первую картинку
                let firstImage = "";

                if (pub.images && Array.isArray(pub.images)) {
                  const imagesArray = pub.images as ImageType[];
                  if (imagesArray.length > 0) {
                    const firstImg = imagesArray[0];
                    if (typeof firstImg === "string") {
                      firstImage = firstImg;
                    } else if (
                      firstImg &&
                      typeof firstImg === "object" &&
                      "image" in firstImg
                    ) {
                      firstImage = firstImg.image;
                    }
                  }
                }

                return (
                  <ItemCard
                    key={pub.id}
                    itemId={pub.id}
                    title={pub.name}
                    exchangeItem={pub.price}
                    slug={pub.slug}
                    isFree={parseFloat(pub.price) === 0 || !pub.price}
                    images={firstImage}
                  />
                );
              })}
            </div>

            {isSearchActive &&
              searchQuery &&
              filteredAndSortedPublications.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                  По запросу "{searchQuery}" ничего не найдено
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;