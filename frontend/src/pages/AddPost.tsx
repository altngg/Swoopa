import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import ServiceButton from "../components/ButtonFilled";
import InvertedButton from "../components/ButtonOutline";
import { publicationsApi } from "../api/publicationsApi";

const AddPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [postType, setPostType] = useState<"service" | "product">("service");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exchangeFor, setExchangeFor] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загружаем данные для редактирования, если они есть
  useEffect(() => {
    if (location.state?.mode === "edit" && location.state?.adData) {
      setIsEditMode(true);
      const adData = location.state.adData;
      setTitle(adData.title || "");
      setExchangeFor(adData.exchangeItem || "");
      // Здесь можно загрузить дополнительные данные, если они есть
      // setDescription(adData.description || '');
      // setPostType(adData.type || 'service');
    }
  }, [location.state]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      const totalFiles = photos.length + newFiles.length;
      if (totalFiles > 5) {
        alert("Можно загрузить не более 5 фотографий");
        const filesToAdd = newFiles.slice(0, 5 - photos.length);
        setPhotos([...photos, ...filesToAdd]);
      } else {
        setPhotos([...photos, ...newFiles]);
      }

      event.target.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handlePublish = () => {
    const data = {
      name: title,
      price: exchangeFor,
      description,
      publication_type_slug: postType,
      status: 1, // по хорошему сделать статус по slug/sysname
      publication_images: photos.map((photo) => photo.name),
    };

    console.log(isEditMode ? "Редактирование:" : "Публикация:", data);

    if (isEditMode) {
      publicationsApi.updatePublication("godheavens", data); // ВОТ ТУТ СЛАГ
      alert("Объявление обновлено!");
    } else {
      publicationsApi.createPublication(data);
      alert("Объявление опубликовано!");
    }

    navigate("/user-account");
  };

  const getPlaceholderText = () => {
    return postType === "service"
      ? "Урок английского (45 минут)"
      : "Кофемашина DeLonghi";
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Заголовок с кнопкой возврата */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <LeftOutlined className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Редактировать публикацию" : "Новая публикация"}
        </h1>
      </div>

      {/* Основной контейнер */}
      <div className="ml-11">
        {/* Переключение Услуга/Товар */}
        <div className="flex gap-4 mb-8">
          {postType === "service" ? (
            <ServiceButton onClick={() => setPostType("service")}>
              Услуга
            </ServiceButton>
          ) : (
            <InvertedButton
              text="Услуга"
              onClick={() => setPostType("service")}
              className="text-gray-700"
            />
          )}

          {postType === "product" ? (
            <ServiceButton onClick={() => setPostType("product")}>
              Товар
            </ServiceButton>
          ) : (
            <InvertedButton
              text="Товар"
              onClick={() => setPostType("product")}
            />
          )}
        </div>

        {/* Форма добавления/редактирования публикации */}
        <div className="space-y-8">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Введите название {postType === "service" ? "услуги" : "товара"}
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Например: {getPlaceholderText()}
            </p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Введите описание
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Например: {getPlaceholderText()}
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите детали..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Услуга для обмена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите {postType === "service" ? "услугу" : "товар"} для обмена
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Например: {getPlaceholderText()}
            </p>
            <input
              type="text"
              value={exchangeFor}
              onChange={(e) => setExchangeFor(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Прикрепление фотографий */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Прикрепите фотографии (не более пяти)
            </label>
            <p className="text-sm text-gray-500 mb-2">Прикрепить файл</p>

            {/* Скрытый input для выбора файлов */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Кнопка добавления фото */}
            <ServiceButton
              onClick={handleAddPhotoClick}
              className="mb-4"
              disabled={photos.length >= 5}
            >
              Прикрепить файл
            </ServiceButton>

            {/* Галерея прикрепленных фото */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Прикрепленное фото ${index + 1}`}
                      className="w-[76px] h-[76px] object-cover rounded"
                      onLoad={() => {
                        URL.revokeObjectURL(URL.createObjectURL(photo));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка публикации/обновления */}
          <div className="flex justify-end">
            <InvertedButton
              text={isEditMode ? "Обновить" : "Опубликовать"}
              onClick={handlePublish}
              className="px-8 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
