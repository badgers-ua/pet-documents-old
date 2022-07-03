import React from 'react';
import { NODE_ENV } from './types';

const initWdyr = async () => {
  if (process.env.NODE_ENV === NODE_ENV.DEV) {
    const whyDidYouRender = (
      await import('@welldone-software/why-did-you-render')
    ).default;
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      trackHooks: true,
    });
  }
};

initWdyr();
