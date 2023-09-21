// gatsby-browser.js

import React from 'react';
import { AuthProvider } from './src/context/AuthContext.js';

export const wrapRootElement = ({ element }) => (
    <AuthProvider>
        {element}
    </AuthProvider>
);
