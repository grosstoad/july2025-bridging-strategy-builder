# Setup


1. Configure npm registry:
   - Create `.npmrc` in project root
   - Add the following to the file:
```bash
     registry=https://registry.npmjs.org/
     legacy-peer-deps=true
     ```

2. Create a new Vite project:
   ```bash
   npm create vite@latest . -- --template react-ts
   ```

3. Clean up default files:
   - Delete `src/index.css`
   - Delete `src/App.css`
   - Delete `src/assets` directory

4. Install dependencies:
   ```bash
   # Core dependencies
   npm install @mui/material@^5.x.x @mui/icons-material@^5.x.x @emotion/react@^11.x.x @emotion/styled@^11.x.x
   npm install react-router-dom@^6.x.x react@^18.x.x react-dom@^18.x.x react-hook-form@^7.x.x

   # Development dependencies
   npm install -D @types/react@^18.x.x @types/react-dom@^18.x.x typescript vite
   ```

5. Linting and Formatting
   - Vite's default React/TypeScript template includes a basic ESLint configuration out of the box. No additional setup is required for linting unless you want to customize the rules.
   - For code formatting, you may optionally add Prettier.

6. Configure font
   - Create a new `src/index.css` with Inter font configuration:
     ```css
     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

     :root {
       font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
       line-height: 1.5;
       font-weight: 400;
       -webkit-font-smoothing: antialiased;
       -moz-osx-font-smoothing: grayscale;
     }

     body {
       margin: 0;
       min-height: 100vh;
     }
     ```

7. Set up App component:
   ```tsx
   // src/App.tsx
   import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import { ErrorBoundary } from './components/ErrorBoundary';
   import { Home } from './pages/Home';
   import { Header } from './components/layout/Header';

   const theme = createTheme({
     typography: {
       fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
       button: {
         textTransform: 'none',
       },
       h1: {
         fontWeight: 700,
       },
       h2: {
         fontWeight: 700,
       },
       h3: {
         fontWeight: 700,
       },
       h4: {
         fontWeight: 700,
       },
       h5: {
         fontWeight: 700,
       },
       h6: {
         fontWeight: 700,
       },
     },
   });

   export const App = () => {
     return (
       <ThemeProvider theme={theme}>
         <CssBaseline />
         <ErrorBoundary>
           <BrowserRouter>
             <Header />
             <Routes>
               <Route path="/" element={<Home />} />
               {/* Add more routes as needed */}
             </Routes>
           </BrowserRouter>
         </ErrorBoundary>
       </ThemeProvider>
     );
   };
   ```

8. Create Header component:
   - Create a new file at `src/components/layout/Header.tsx` with the following content:
     ```tsx
     import { type FC } from 'react';
     import { AppBar, Toolbar, Box } from '@mui/material';

     export const Logo: FC = () => (
       <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="none">
         <path id="svg_1" fill="#B40000" d="m19.434,20.1475l-0.372,-16.125l-3.096,17.582l3.647,6.373l-0.18,-7.83l0.001,0z"/>
         <path id="svg_2" fill="#FF0001" d="m29.732,27.9775l-10.67,-23.955l0.551,23.955l10.119,0z"/>
         <path id="svg_3" fill="#FF009F" d="m19.062,4.0225l-16.794,23.955l12.576,0l4.218,-23.955z"/>
         <path id="svg_4" fill="#B40000" d="m11.818,14.3575l7.794,13.62l10.119,0l-17.914,-13.62l0.001,0z" clipRule="evenodd" fillRule="evenodd"/>
       </svg>
     );

     export const Header: FC = () => {
       return (
         <AppBar
           position="static"
           color="transparent"
           elevation={0}
         >
           <Toolbar>
             <Box
               component="a"
               href="/"
               sx={{
                 display: 'flex',
                 alignItems: 'center',
                 textDecoration: 'none',
                 color: 'inherit'
               }}
             >
               <Logo />
             </Box>
           </Toolbar>
         </AppBar>
       );
     };
     ```

9. Set up Home component:
   ```tsx
   // src/pages/Home.tsx
   import { type FC } from 'react';
   import { Container, Typography, Box } from '@mui/material';

   export const Home: FC = () => {
     return (
       <Container>
         <Box
           sx={{
             py: 4,
           }}
         >
           <Typography variant="h3" component="h1">
             Hello, Athena
           </Typography>
         </Box>
       </Container>
     );
   };
   ```

10. Verify setup:
   Before running the project, verify the following:
   - All required files exist in correct locations:
     - `src/App.tsx` with Material-UI and React Router setup
     - `src/main.tsx` with proper React 18 setup
     - `src/index.css` with Inter font configuration
     - `src/components/ErrorBoundary.tsx` with the provided implementation
     - `src/components/layout/Header.tsx` with the logo implementation
     - `src/pages/Home.tsx` with the provided implementation
   - Package.json has all required dependencies:
     - @mui/material and @mui/icons-material
     - react-router-dom
   - .npmrc exists with correct registry configuration
   - Project structure follows organization guidelines
   - All components follow accessibility requirements
   - Theme configuration is properly set up
   - Header with logo is implemented correctly

   If any checks fail, review the setup steps above and make necessary corrections.

11. Check for TypeScript errors:
    ```bash
    # Run TypeScript compiler in watch mode to check for errors
    npx tsc --noEmit

    # Check for tsconfig.json issues
    npx tsc --showConfig

    # Verify ErrorBoundary component exists and has proper types
    # The ErrorBoundary component should be in src/components/ErrorBoundary.tsx
    # with proper React error boundary types and implementation
    ```
   Fix any type errors, tsconfig issues, or missing ErrorBoundary implementation before proceeding to the next step.

   Required ErrorBoundary implementation:
   ```tsx
   // src/components/ErrorBoundary.tsx
   import { Component, type ErrorInfo, type ReactNode } from 'react';
   import { Box, Typography, Button } from '@mui/material';

   interface Props {
     children: ReactNode;
   }

   interface State {
     hasError: boolean;
     error: Error | null;
   }

   export class ErrorBoundary extends Component<Props, State> {
     constructor(props: Props) {
       super(props);
       this.state = { hasError: false, error: null };
     }

     static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
       console.error('Error caught by boundary:', error, errorInfo);
     }

     render(): ReactNode {
       if (this.state.hasError) {
         return (
           <Box sx={{ p: 3, textAlign: 'center' }}>
             <Typography variant="h5" gutterBottom>
               Something went wrong
             </Typography>
             <Typography variant="body1" color="text.secondary" gutterBottom>
               {this.state.error?.message}
             </Typography>
             <Button
               variant="contained"
               onClick={() => window.location.reload()}
               disableElevation
               sx={{ mt: 2 }}
             >
               Reload Page
             </Button>
           </Box>
         );
       }

       return this.props.children;
     }
   }
   ```

12. Verify named exports and imports:
    - Ensure all components use named exports:
      ```tsx
      // Example of correct named export
      export const ComponentName = () => {
        // Component implementation
      };
      ```
    - Update all imports to use named imports:
      ```tsx
      // Example of correct named import
      import { ComponentName } from './path/to/component';
      ```
    - Specifically check these files:
      - `src/main.tsx` should import App as: `import { App } from './App'`
      - `src/App.tsx` should export App as: `export const App = () => { ... }`
      - All page components should use named exports
      - All component imports in App.tsx should use named imports
    - Remove any default exports or imports
    - Run TypeScript compiler to verify no import/export errors:
      ```bash
      npx tsc --noEmit
      ```

13. Configure npm scripts:
    - Open `package.json`
    - Add or update the scripts section:
      ```json
      {
        "scripts": {
          "dev": "vite",
          "start": "vite",
          "build": "tsc && vite build",
          "preview": "vite preview"
        }
      }
      ```

14. Start the development server:
    ```bash
    npm start
    ```
