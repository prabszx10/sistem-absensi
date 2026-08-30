import React from 'react';
import { Result } from 'antd';

export const Error403Page: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
  />
);