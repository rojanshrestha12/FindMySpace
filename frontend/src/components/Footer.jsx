import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-center bg-white mt-6">
      <div className="relative">
        <img src="/assets/footer.png" alt="Footer Background" className="w-full object-cover" />
<<<<<<< HEAD
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mb-30">
=======
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
>>>>>>> frontend_d_D
          <p className="text-black">Near Naxal, Herald College Kathmandu, Nepal</p>
          <p className="text-black">(+977) 01-44456845, 9858477538</p>
          <p className="text-black">Contact Us: info@FindMySpace.com</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="#"><img src="/assets/instagram.png" alt="Instagram" className="w-6" /></Link>
            <Link to="#"><img src="/assets/facebook.png" alt="Facebook" className="w-6" /></Link>
            <Link to="#"><img src="/assets/twitter.png" alt="Twitter" className="w-6" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

<<<<<<< HEAD
export default Footer;
=======
export default Footer;
>>>>>>> frontend_d_D
