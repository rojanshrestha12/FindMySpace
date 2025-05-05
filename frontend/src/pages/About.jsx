// import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      <Navbar />

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
<Footer/>
    </div>
  );
}

export default About; 