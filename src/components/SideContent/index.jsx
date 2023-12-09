import { Layout } from 'antd';

import logo from '@/style/images/logo.png';


const { Content } = Layout;


export default function SideContent() {
  return (
    <Content
      style={{
        margin: 'auto',
        position: 'relative',
        padding: '100px',
        paddingBottom: '140px',
        width: '100%',
        backgroundColor:'white',
      }
    }
      className="sideContent"
    >
      <div style={{ width: '100%'}}>
        <img src={logo} alt="Logo" style={{ margin: '0 auto 40px', display: 'block',marginLeft: '100px', }} />
        <div className="space40">
        <h1 className='caption' style={{marginTop:'-110px',marginLeft:'230px',color: 'black'}}>Health is Wealth</h1>
        </div>
        
        {/* <Divider /> */}
      </div>
    </Content>
  );
}
