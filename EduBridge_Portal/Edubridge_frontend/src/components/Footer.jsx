import React from 'react';
import '../assets/css/Footer.scss';

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} EduBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
