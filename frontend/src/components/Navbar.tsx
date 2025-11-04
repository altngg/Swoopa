import '../index.css'
import { EnvironmentOutlined, HeartFilled, MessageOutlined, UserOutlined } from '@ant-design/icons';

function Navbar() {

  const isLoggedIn = true;

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
            <div className="font-galindo ml-[2.5rem] text-[1.25rem] pt-[3px]">SWOOPA</div>
            <div className="flex items-center gap-1 text-gray-600">
            <EnvironmentOutlined style={{ fontSize: '20px', paddingLeft: '1rem' }}/>
            <span className="text-[1rem] pl-[0.05rem]">Москва</span>
            </div>
        </div>
        
        {
          !isLoggedIn && 
            <div className="flex items-center gap-4">
              <HeartFilled style={{ fontSize: '20px', paddingRight: '1rem' }}/>
              <div className="flex gap-3 text-sm">
                <span className="text-[1rem] pr-[0.5rem] font-inter">Войти</span>
                <span className="text-[1rem] pr-[1rem] mr-[2.5rem] font-inter">Зарегистрироваться</span>
              </div>
            </div>
        }

        {
          isLoggedIn && 
            <div className="flex items-center gap-4">
              <HeartFilled style={{ fontSize: '20px', paddingRight: '1rem' }}/>
              <div className="flex gap-3 text-sm">
                <MessageOutlined style={{ fontSize: '20px', paddingRight: '1rem' }}/>
                <UserOutlined style={{ fontSize: '20px', paddingRight: '2.5rem' }}/>
              </div>
            </div>
        }
            
    </nav>
  )
}

export default Navbar;
