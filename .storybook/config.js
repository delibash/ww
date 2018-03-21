import React from 'react';
import { configure, addDecorator } from '@kadira/storybook';
const req = require.context('../app/components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

addDecorator((story) => (
  <div style={{fontSize: '12px', lineHeight: '1.5', fontFamily: '"Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'}}>
    {story()}
  </div>
));

configure(loadStories, module);
