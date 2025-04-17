import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      {/* Common Header visible on all pages */}
      <Header />

      {/* Main content area where nested routes will render */}
      <main>
        <Outlet />
      </main>

      {/* Common Footer visible on all pages */}
      <Footer />
    </>
  );
}

export default App;
