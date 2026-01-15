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

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-4xl flex">
          <div className="flex-1 hidden lg:flex flex-col justify-center p-12 bg-gray-100 rounded-l-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Добро пожаловать в SWOOPA
            </h1>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">
                  Обменивайтесь вещами бесплатно
                </span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">
                  Находите нужные предметы рядом с вами
                </span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">
                  Безопасные сделки и сообщения
                </span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Экологично и экономично</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 bg-white p-8 lg:p-12 rounded-r-2xl shadow-lg">
            <AuthForm initialMode={initialMode} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2026 SWOOPA. Все права защищены.</p>
            <p className="mt-2">
              <Link
                to="/privacy"
                className="hover:text-gray-700 transition-colors"
              >
                Политика конфиденциальности
              </Link>
              {" • "}
              <Link
                to="/terms"
                className="hover:text-gray-700 transition-colors"
              >
                Условия использования
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
