// // gatsby-ssr.js

// import React from 'react';
// import { AuthProvider } from './src/context/AuthContext.js';

// export const wrapRootElement = ({ element }) => (
//     <AuthProvider>
//         {element}
//     </AuthProvider>
// );

import React from 'react';
import { AuthProvider } from './src/context/AuthContext.js';
import { ClerkProvider } from "@clerk/clerk-react";

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//     throw new Error("Missing Publishable Key")
// }
const clerkPubKey = 'pk_test_bmVhdC1ncmFja2xlLTI1LmNsZXJrLmFjY291bnRzLmRldiQ';
// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export const wrapRootElement = ({ element }) => (
    <ClerkProvider publishableKey={clerkPubKey}>
        <AuthProvider>
            {element}
        </AuthProvider>
    </ClerkProvider>
);
