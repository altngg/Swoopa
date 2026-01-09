import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, message, Select } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import ServiceButton from './ButtonFilled';
import InvertedButton from './ButtonOutline';
import { authApi } from '../api/authApi';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

interface FormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  location_id?: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
  message?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Array<{id: number, city: string}>>([]);
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'register') {
      loadLocations();
    }
  }, [initialMode]);

  const loadLocations = async () => {
    try {
      const locationsData = await authApi.getLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Ошибка при загрузке локаций:', error);
    }
  };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const response = await authApi.login({
          username: values.email,
          password: values.password,
        });
        message.success(response.message);
        navigate('/feed');
      } else {
        if (!values.location_id && locations.length > 0) {
          values.location_id = locations[0].id;
        }
        
        const response = await authApi.register({
          username: values.name!,
          email: values.email,
          password: values.password,
          location: values.location_id || 1,
        });
        message.success(response.message);
        navigate('/feed');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 
                          apiError.response?.data?.detail || 
                          apiError.message || 
                          'Ошибка при выполнении операции';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' 
            ? 'Введите ваши данные для входа' 
            : 'Заполните форму для регистрации'}
        </p>
      </div>

      <Form<FormValues>
        form={form}
        name={mode}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4"
      >
        {mode === 'register' && (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Имя пользователя"
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Пожалуйста, введите email!' },
            { type: 'email', message: 'Введите корректный email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        {mode === 'register' && (
          <Form.Item
            name="location_id"
            label="Город"
            rules={[{ required: true, message: 'Пожалуйста, выберите город!' }]}
          >
            <Select
              placeholder="Выберите город"
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                  {location.city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Пожалуйста, введите пароль!' },
            { min: 6, message: 'Пароль должен быть минимум 6 символов!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        {mode === 'register' && (
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Подтвердите пароль"
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item>
          <ServiceButton
            onClick={() => form.submit()}
            disabled={loading}
            className="w-full !px-4 !py-3 !text-base"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </ServiceButton>
        </Form.Item>
      </Form>

      <div className="text-center mt-6">
        <p className="text-gray-600 mb-4">
          {mode === 'login' 
            ? 'Нет аккаунта?' 
            : 'Уже есть аккаунт?'}
        </p>
        <InvertedButton
          text={mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          onClick={() => {
            const newMode = mode === 'login' ? 'register' : 'login';
            setMode(newMode);
            form.resetFields();
            navigate(`/login?mode=${newMode}`, { replace: true });
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AuthForm;