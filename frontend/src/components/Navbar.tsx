import '../index.css'
import { EnvironmentOutlined, HeartFilled, MessageOutlined, UserOutlined } from '@ant-design/icons';

function Navbar() {

  const isLoggedIn = true;

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
            <div className="font-galindo ml-[2.5rem] text-[1.25rem] pt-[3px]">SWOOPA</div>
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
                        transition: 'color 0.2s ease-in-out'
                    }}
                    className="hover:text-blue-500"
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
              <div className="cursor-pointer">
                <HeartFilled 
                    style={{ 
                        fontSize: '20px', 
                        paddingRight: '1rem',
                        transition: 'color 0.2s ease-in-out'
                    }}
                    className="hover:text-blue-500"
                />
              </div>
              <div className="flex gap-3 text-sm pb-[3px]">
                <span className="text-[1rem] pr-[0.5rem] font-inter cursor-pointer">Войти</span>
                <span className="text-[1rem] pr-[1rem] mr-[2.5rem] font-inter cursor-pointer">Зарегистрироваться</span>
              </div>
            </div>
        }
            
    </nav>
  )
}

export default Navbar;
