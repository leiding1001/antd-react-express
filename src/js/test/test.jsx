import React, {Component} from 'react';
import {Input, Button, Menu, Icon} from 'antd';

import '../../css/test.css';
import '../../css/style.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class DefaultView extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const el = this.refs.v1
  }

  renderMenu() {
    return (
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        style={{
          width: 256,
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>{'Navigation One'}</span></span>}>
          <MenuItemGroup key="g1" title="Item 1">
            <Menu.Item key="1">{'Option 1'}</Menu.Item>
            <Menu.Item key="2">{'Option 2'}</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="Item 2">
            <Menu.Item key="3">{'Option 3'}</Menu.Item>
            <Menu.Item key="4">{'Option 4'}</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>{'Navigation Two'}</span></span>}>
          <Menu.Item key="5">{'Option 5'}</Menu.Item>
          <Menu.Item key="6">{'Option 6'}</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">{'Option 7'}</Menu.Item>
            <Menu.Item key="8">{'Option 8'}</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>{'Navigation Three'}</span></span>}>
          <Menu.Item key="9">{'Option 9'}</Menu.Item>
          <Menu.Item key="10">{'Option 10'}</Menu.Item>
          <Menu.Item key="11">{'Option 11'}</Menu.Item>
          <Menu.Item key="12">{'Option 12'}</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  render() {
    return (
      <div>
        {this.renderMenu()}
        <div className="main-panel">
          <div className="v-form">
            <div className="p-line title">
              {'Welcome to Login!'}
            </div>
            <div className="p-line">
              <Input
                addonBefore={<i className="icon-user" />}
                className="p-text"
              />
            </div>
            <div className="p-line">
              <Input
                addonBefore={<i className="icon-key2" />}
                className="p-text"
              />
            </div>
            <div className="p-line btn">
              <Button type="primary">{'Submit'}</Button>
            </div>
            <div className="p-line link">
              <a href="">{'Sign Up'}</a>
            </div>
          </div>
        </div>
        <section className="section-video">
          <video
            autoPlay
            className="primary-video"
            loop
            preload="metadata"
          >
            <source
              media="(min-width: 640px)"
              src="./pt.mp4"
              type="video/mp4"
            />
            <source
              media="(min-width: 640px)"
              src="./pt.webm"
              type="video/webm"
            />
          </video>
        </section>
      </div>
    );
  }
}

export default DefaultView;
