import '../index.css'
import { EnvironmentOutlined, HeartFilled } from '@ant-design/icons';

function Navbar() {

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
            <div className="font-galindo ml-[2.5rem] text-[1.25rem] pt-[3px]">SWOOPA</div>
            <div className="flex items-center gap-1 text-gray-600">
            <EnvironmentOutlined style={{ fontSize: '20px', paddingLeft: '1rem' }}/>
            <span className="text-[1rem] pl-[0.05rem]">Москва</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <HeartFilled style={{ fontSize: '20px', paddingRight: '1rem' }}/>
            <div className="flex gap-3 text-sm">
            <span className="text-[1rem] pr-[0.5rem] font-inter">Войти</span>
            <span className="text-[1rem] pr-[1rem] mr-[2.5rem] font-inter">Зарегистрироваться</span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar;
