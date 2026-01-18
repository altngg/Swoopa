import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Navbar from "../components/Navbar";

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row">
          {/* Левая часть с преимуществами */}
          <div className="flex-1 lg:flex flex-col justify-center p-6 sm:p-8 md:p-12 bg-gray-100 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none order-2 lg:order-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center lg:text-left">
              Добро пожаловать в SWOOPA
            </h1>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-start sm:items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-700 text-sm sm:text-base">
                  Обменивайтесь вещами бесплатно
                </span>
              </li>
              <li className="flex items-start sm:items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-700 text-sm sm:text-base">
                  Находите нужные предметы рядом с вами
                </span>
              </li>
              <li className="flex items-start sm:items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-700 text-sm sm:text-base">
                  Безопасные сделки и сообщения
                </span>
              </li>
              <li className="flex items-start sm:items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-700 text-sm sm:text-base">
                  Экологично и экономично
                </span>
              </li>
            </ul>
            {}
          </div>

          {/* Правая часть с формой */}
          <div className="flex-1 bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-t-2xl lg:rounded-r-2xl lg:rounded-tl-none shadow-lg order-1 lg:order-2">
            <div className="mb-4 lg:mb-6">
              
            </div>
            <AuthForm initialMode={initialMode} />
            
            {/* Единый блок для переключения режима - показывается ВСЕГДА */}
            
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>© 2026 SWOOPA. Все права защищены.</p>
            <div className="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <Link
                to="/privacy"
                className="hover:text-gray-700 transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                to="/terms"
                className="hover:text-gray-700 transition-colors"
              >
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
