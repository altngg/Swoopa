import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import ServiceButton from "../components/ButtonFilled";
import InvertedButton from "../components/ButtonOutline";
import { publicationsApi } from "../api/publicationsApi";

interface ExistingImage {
  id: number;
  image: string;
}

const AddPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [postType, setPostType] = useState<"service" | "product">("service");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exchangeFor, setExchangeFor] = useState("");

  const [photos, setPhotos] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<ExistingImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загружаем данные для редактирования, если они есть
  useEffect(() => {
    if (location.state?.mode === "edit" && location.state?.adData) {
      setIsEditMode(true);
      const adData = location.state.adData;
      setTitle(adData.title || "");
      setExchangeFor(adData.exchangeItem || "");
      setDescription(adData.description || "");
      setPostType(adData.publication_type_name || "service");

      const images: ExistingImage[] = [];

      if (adData.images) {
        adData.images.forEach((image: any) => {
          if (image.image) {
            images.push({
              id: image.id,
              image: `http://localhost:8000${image.image}`,
            });
          }
        });
      }

      setExistingImages(images);
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
      const totalFiles =
        existingImages.length + photos.length + newFiles.length;

      if (totalFiles > 5) {
        alert("Можно загрузить не более 5 фотографий");
        const filesToAdd = newFiles.slice(
          0,
          5 - (existingImages.length + photos.length)
        );
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

  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];

    if (imageToRemove.id) {
      setImagesToDelete((prev) => [...prev, imageToRemove]);
    }

    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };

  const handlePublish = async () => {
    const data = {
      name: title,
      price: exchangeFor,
      description,
      publication_type_slug: postType,
      status: 1, // по хорошему сделать статус по slug/sysname
      additional_images: photos,
    };

    console.log(isEditMode ? "Редактирование:" : "Публикация:", data);

    if (imagesToDelete.length > 0) {
      // needs to be fixed, but done so because shouldn't send empty array to backend
      data.images_to_delete_ids = imagesToDelete.map((item) => item.id);
    }

    try {
      await (isEditMode
        ? publicationsApi.updatePublication(location.state?.adData?.slug, data)
        : publicationsApi.createPublication(data));

      alert(`Объявление ${isEditMode ? "обновлено" : "опубликовано"}!`);
    } catch (error) {
      console.log(error);
      alert(`Ошибка при ${isEditMode ? "обновлении" : "создании"} публикации.`);
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
              disabled={existingImages.length + photos.length >= 5}
            >
              Прикрепить файл
            </ServiceButton>

            {/* Галерея прикрепленных фото */}
            {(existingImages.length > 0 || photos.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Существующие изображения */}
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={image.image}
                      alt={`Существующее изображение ${index + 1}`}
                      className="w-[76px] h-[76px] object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      title="Удалить изображение"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Новые загруженные фото */}
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

            <p className="text-sm text-gray-500 mt-2">
              Загружено: {existingImages.length + photos.length}/5
            </p>
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
