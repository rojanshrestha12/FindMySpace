import { useState } from "react";
import { Link } from "react-router-dom";

function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-[#d6b899] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="ml-85">
            <img src="/assets/logo.png" alt="Logo" className="w-25" />
          </div>
        </div>
        <div className="hidden md:flex space-x-8 text-lg">
          <Link to="/dashboard" className="text-black">Home</Link>
          <Link to="/PropertyForm" className="text-black">Add Property</Link>
          <Link to="/about" className="text-black">About Us</Link>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">☰</button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Login</Link>
              <Link to="/register" className="block px-4 py-2 hover:bg-gray-200">Register</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold mb-8 text-[#2C3E50]">About Find My Space</h1>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We at Find My Space are dedicated to revolutionizing your property search experience. 
              Our innovative platform makes finding your ideal property as simple as looking through 
              a magnifying glass. With our carefully curated listings and verified property details, 
              we ensure that your search for the perfect space is both efficient and reliable.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Our commitment to transparency and quality means every property on our platform 
              undergoes thorough verification. We believe in making property hunting a clear, 
              straightforward process, helping you focus on what truly matters - finding your 
              perfect space.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Let us be your lens into the world of real estate. With Find My Space, 
              discovering your dream property is not just a search - it's a journey towards 
              finding your perfect match in the vast real estate landscape.
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="bg-white p-0.5 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img 
                src="/assets/about.jpg" 
                alt="Property Search Illustration" 
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#00A3B8] w-20 h-20 rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 bg-[#00A3B8] w-16 h-16 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center bg-white">
        <div className="relative">
          <img src="/assets/footer.png" alt="Footer Background" className="w-full object-cover" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 mb-50">
            <p className="text-black bg-opacity-40 px-3 py-1 rounded-lg">
              Near Naxal, Herald College Kathmandu, Nepal
            </p>
            <p className="text-black bg-opacity-40 px-3 py-1 rounded-lg">
              (+977) 01-44456845, 9858477538
            </p>
            <p className="text-black bg-opacity-40 px-3 py-1 rounded-lg">
              Contact Us: info@FindMySpace.com
            </p>

            <div className="flex justify-center space-x-4 mt-2">
              <Link to="#"><img src="/assets/instagram.png" alt="Instagram" className="w-6" /></Link>
              <Link to="#"><img src="/assets/facebook.png" alt="Facebook" className="w-6" /></Link>
              <Link to="#"><img src="/assets/twitter.png" alt="Twitter" className="w-6" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About; 