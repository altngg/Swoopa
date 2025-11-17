import '../index.css'
import { EnvironmentOutlined, HeartFilled, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = true;

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleMessagesClick = () => {
    navigate('/user-account/messages');
  };

  const handleUserClick = () => {
    navigate('/user-account');
  };

  return (
    <nav className="flex items-center justify-between p-3 bg-white">
        <div className="flex items-center gap-3">
            <div 
              className="font-galindo ml-[2.5rem] text-[1.25rem] pt-[3px] cursor-pointer"
              onClick={() => navigate('/feed')}
            >
              SWOOPA
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <EnvironmentOutlined style={{ fontSize: '20px', paddingLeft: '1rem' }}/>
              <span className="text-[1rem] pl-[0.05rem]">Москва</span>
            </div>
        </div>
        
        {
          !isLoggedIn && 
            <div className="flex items-center gap-4">
              <div className="cursor-pointer">
                <HeartFilled 
                    style={{ 
                        fontSize: '20px', 
                        paddingRight: '1rem',
                    }}
                />
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-[1rem] pr-[0.5rem] font-inter cursor-pointer">Войти</span>
                <span className="text-[1rem] pr-[1rem] mr-[2.5rem] font-inter cursor-pointer">Зарегистрироваться</span>
              </div>
            </div>
        }

        {
          isLoggedIn && 
            <div className="flex items-center gap-4">
              <div className="cursor-pointer" onClick={handleFavoritesClick}>
                <HeartFilled style={{ fontSize: '20px', paddingRight: '1rem' }}/>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="cursor-pointer" onClick={handleMessagesClick}>
                  <MessageOutlined style={{ fontSize: '20px', paddingRight: '1rem' }}/>
                </div>
                <div className="cursor-pointer" onClick={handleUserClick}>
                  <UserOutlined style={{ fontSize: '20px', paddingRight: '2.5rem' }}/>
               </div>
              </div>
            </div>
        }
    </nav>
  )
}

export default Navbar;