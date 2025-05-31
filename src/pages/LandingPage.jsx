// src/pages/LandingPage.jsx - Updated for Ethereum
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // Replace Solana import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, faRobot, faFileContract, faSearchDollar, 
  faUserNinja, faCheck, faBullseye, faCoins, faMapMarkedAlt,
  faHandshake, faUsers, faEnvelope, faPhone, faBars, faTimes,
  faFileSignature, faProjectDiagram, faPlayCircle, faPaw,
  faBolt, faLink
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, faTelegram, faDiscord
} from '@fortawesome/free-brands-svg-icons';

// Import images
import doge3D from '../assets/images/2.png';
import dogeEvolution from '../assets/images/1.png';
import missionBg from '../assets/images/5.png';
import howItWorksBg from '../assets/images/10.png';
import stpLogo from '../assets/images/STP.webp';
import barneyImg from '../assets/images/barney.png';
import jaqbekImg from '../assets/images/jaqbek.png';
import sandraImg from '../assets/images/sandra.png';
import walentynImg from '../assets/images/walentyn.png';
import paulaImg from '../assets/images/paula.png';
import maciejkiImg from '../assets/images/maciejki.png';
import mikiImg from '../assets/images/miki.png';
import EthereumWalletButton from '../components/Wallet/EthereumWalletButton';
import DOGEAssist from '../utils/DOGEAssist';

// Ethereum icon component
const EthereumIcon = ({ className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 256 417" 
      className={className}
      fill="currentColor"
    >
      <path fill="#343434" d="m127.9611 0-2.2909 7.9395v250.969l2.2909 2.2909 127.9611-75.9395L127.9611 0z"/>
      <path fill="#8C8C8C" d="m127.9611 0L0 185.2703l127.9611 75.9395V0z"/>
      <path fill="#3C3C3B" d="m127.9611 285.168-1.2958 1.5823v98.1767l1.2958 3.7672L256 208.7273l-128.0389 76.4407z"/>
      <path fill="#8C8C8C" d="M127.9611 388.6942V285.168L0 208.7273l127.9611 179.9669z"/>
      <path fill="#141414" d="m127.9611 261.2098 127.9611-75.9395-127.9611-58.2503v134.1898z"/>
      <path fill="#393939" d="m0 185.2703 127.9611 75.9395V127.02L0 185.2703z"/>
    </svg>
  );
};

// Team member data
const teamMembers = [
  {
    name: "Barney",
    title: "CEO & Founder",
    description: "CEO, Fullstack, Blockchain & A.I. Engineer",
    image: barneyImg
  },
  {
    name: "Jaqbek",
    title: "Blockchain Developer",
    description: "Frontend, web3 integrator, blockchain developer",
    image: jaqbekImg
  },
  {
    name: "Sandra",
    title: "Blockchain Developer",
    description: "Blockchain ethereum developer, fullstack developer",
    image: sandraImg
  },
  {
    name: "Walentyn",
    title: "Blockchain Developer",
    description: "Blockchain ethereum developer, solidity developer",
    image: walentynImg
  },
  {
    name: "Paula",
    title: "Lawyer",
    description: "Law and regulations, language, canva design",
    image: paulaImg
  },
  {
    name: "Maciejki",
    title: "Blockchain developer",
    description: "Frontend, web3 integrator",
    image: maciejkiImg
  },
  {
    name: "Miki",
    title: "Blockchain developer",
    description: "Frontend, web3 integrator, blockchain developer",
    image: mikiImg
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // Replace useWallet
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Reference for the mobile menu
  const mobileMenuRef = useRef(null);
  
  // Optional: Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) { // Replace connected
      navigate('/dashboard');
    }
  }, [isConnected, navigate]); // Replace connected

  useEffect(() => {
    // Function to handle scroll effects for navigation
    const handleScroll = () => {
      const nav = document.querySelector('.fixed-nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      }
    };
  
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation for feature cards on scroll
  useEffect(() => {
    const featureCards = document.querySelectorAll('.feature-card');
    const solutionsCards = document.querySelectorAll('.solutions-card');
    const howItWorksCards = document.querySelectorAll('.how-it-works-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });

    solutionsCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease 0.2s';
      observer.observe(card);
    });
    
    howItWorksCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease 0.4s';
      observer.observe(card);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    
    // Cleanup observer on component unmount
    return () => {
      featureCards.forEach(card => {
        observer.unobserve(card);
      });
      solutionsCards.forEach(card => {
        observer.unobserve(card);
      });
      howItWorksCards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically handle form submission to your server
    console.log('Form submitted:', formData);
    
    // For demo purposes, we'll just show an alert
    alert(`Thank you, ${formData.name}! Your application has been submitted. We'll contact you at ${formData.email} soon.`);
    
    // Reset form and close modal
    setFormData({ name: '', email: '', message: '' });
    setShowJoinModal(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.classList.contains('mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuRef]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('modal')) {
        setShowTeamModal(false);
        setShowJoinModal(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showTeamModal || showJoinModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTeamModal, showJoinModal]);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#0a0a0a', color: '#ffffff', overflowX: 'hidden' }}>

      {/* Fixed Navigation */}
      <nav className="fixed-nav fixed top-0 left-0 right-0 flex justify-between items-center p-6 px-8 bg-black bg-opacity-95 z-50 shadow-md">
        <div className="text-xl font-bold gold-text">My Company D.O.G.E.</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#story" className="nav-link hover:text-yellow-300 transition">Story</a>
          <a href="#features" className="nav-link hover:text-yellow-300 transition">Features</a>
          <a href="#mission" className="nav-link hover:text-yellow-300 transition">Mission</a>
          <a href="#solutions" className="nav-link hover:text-yellow-300 transition">Solutions</a>
          <a href="#how-it-works" className="nav-link hover:text-yellow-300 transition">How It Works</a>
          <a href="#tokenomics" className="nav-link hover:text-yellow-300 transition">Tokenomics</a>
          <button 
            className="join-btn gold-bg text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-600 transition flex items-center"
            onClick={() => setShowJoinModal(true)}
          >
            <FontAwesomeIcon icon={faPaw} className="mr-2" /> Join
          </button>
          <EthereumWalletButton />
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-2xl" />
        </button>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-20 left-0 right-0 bg-black bg-opacity-95 shadow-lg rounded-b-lg py-4 px-6 md:hidden z-50"
          >
            <div className="flex flex-col space-y-4">
              <a href="#story" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>Story</a>
              <a href="#features" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#mission" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>Mission</a>
              <a href="#solutions" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
              <a href="#how-it-works" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#tokenomics" className="nav-link text-white hover:text-yellow-300 transition py-2" onClick={() => setMobileMenuOpen(false)}>Tokenomics</a>
              <div className="pt-2 flex flex-col space-y-3">
                <button 
                  className="join-btn gold-bg text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-600 transition flex items-center justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowJoinModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPaw} className="mr-2" /> Join Community
                </button>
                <div className="mobile-wallet-btn">
                  <EthereumWalletButton onClick={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className="h-1"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div className="absolute top-24 left-0 p-8 text-2xl font-bold gold-text z-10 w-full flex justify-between items-start">
          <div className="max-w-md">
            <p className="mb-2">To sniff waste & smash paperwork to minimum</p>
          </div>
          
          <div className="model-container">
            <div className="model-3d">
              <img src={doge3D} alt="3D My Company D.O.G.E." className="w-48 h-48 md:w-64 md:h-64 object-contain" />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center pt-32 md:pt-40">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="gold-text">From Office Doge</span>
            <span className="block mt-4">to Ninja Mode</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Auctions and tenders made effortless — powered by decentralized, transparent cash flow tracking and an AI assistant that transforms complex paperwork into a task of seconds. All accessible within just a few clicks.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="gold-bg text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-600 transition">
              $MyCompanyDoge
            </button>
            <button className="border gold-border text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-900 hover:bg-opacity-20 transition">
              Whitepaper
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <a href="#story" className="animate-bounce">
            <FontAwesomeIcon icon={faChevronDown} className="text-2xl gold-text" />
          </a>
        </div>
      </section>

      {/* Story/Lore Section */}
      <section id="story" className="py-20 ninja-mode">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">OUR STORY</h2>
            <div className="w-24 h-1 gold-bg mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img src={dogeEvolution} alt="MyCompanyDOGE Evolution" className="w-full rounded-lg shadow-2xl" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl font-bold mb-6 gold-text">The Transformation</h3>
              <p className="text-lg mb-6">
                Every year, billions vanish in scams, broken promises, and shady transactions — and less than 10% is ever recovered. We're here to change that.
              </p>
              <p className="text-lg mb-6">
                Through blockchain transparency, real-time tracking, and smart contracts, we're building a system where trust is built-in — and money stops disappearing.
              </p>
              <p className="text-lg">
                <b>Stop losing. Start using My Company D.O.G.E.</b>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 dark-brown-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">FEATURES</h2>
            <div className="w-24 h-1 gold-bg mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="feature-card p-8 rounded-xl bg-black bg-opacity-50 text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-POWERED AUTOMATION</h3>
              <p className="text-gray-300">
                MyCompanyDOGE's advanced AI algorithms automate tedious tasks, freeing you to focus on what really matters.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card p-8 rounded-xl bg-black bg-opacity-50 text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faFileContract} />
              </div>
              <h3 className="text-2xl font-bold mb-4">PAPERWORK REDUCTION</h3>
              <p className="text-gray-300">
                Slash through bureaucratic red tape with MyCompanyDOGE's blockchain-powered document management.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card p-8 rounded-xl bg-black bg-opacity-50 text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faSearchDollar} />
              </div>
              <h3 className="text-2xl font-bold mb-4">NOSE FOR WASTE</h3>
              <p className="text-gray-300">
                MyCompanyDOGE's keen sense sniffs out inefficiencies and wasted resources in your operations.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card p-8 rounded-xl bg-black bg-opacity-50 text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faUserNinja} />
              </div>
              <h3 className="text-2xl font-bold mb-4">STEALTH MODE</h3>
              <p className="text-gray-300">
                Operate under the radar with MyCompanyDOGE's privacy-focused features and low-profile transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Background Image */}
      <section id="mission" className="py-20" style={{ backgroundImage: `url(${missionBg})`, backgroundSize: 'cover' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">GOALS AND OUR MISSION</h2>
            <div className="w-24 h-1 gold-bg mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black bg-opacity-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 gold-text">Our Vision</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-3" />
                    <span>Create a world where efficiency meets decentralization</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-3" />
                    <span>Eliminate bureaucratic waste through blockchain technology</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-3" />
                    <span>Empower individuals with crypto-powered productivity tools</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-black bg-opacity-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 gold-text">Our Goals</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faBullseye} className="gold-text mt-1 mr-3" />
                    <span>Reliable & Secure: 99.9% uptime with top-tier data protection thanks to Ethereum.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faBullseye} className="gold-text mt-1 mr-3" />
                    <span>Cutting-Edge Features: Beyond competitors, with unique a.i. tools and integration of blockchain into real life.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faBullseye} className="gold-text mt-1 mr-3" />
                    <span>Intuitive Design: Tailored for optimal user experience and navigation, to save his time and make dull and heavy duty tasks easy, fast and blockchained.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section - New Section */}
      <section id="solutions" className="py-20 bg-black bg-opacity-70">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">OUR SOLUTIONS</h2>
            <div className="w-24 h-1 gold-bg mx-auto mb-6"></div>
            <p className="text-xl max-w-3xl mx-auto">
              Revolutionizing auctions and tenders with blockchain-powered transparency and AI efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution 1 */}
            <div className="solutions-card p-8 rounded-xl">
              <div className="solutions-icon text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faSearchDollar} />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Auction Scraping</h3>
              <p className="text-gray-300">
                Our AI assistants continuously monitor and scrape data from thousands of auctions and tenders worldwide, delivering real-time alerts and comprehensive market analysis directly to you.
              </p>
              <div className="mt-6">
                <span className="inline-block bg-yellow-900 bg-opacity-30 text-yellow-300 px-3 py-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faBolt} className="mr-1" /> Real-time Data
                </span>
              </div>
            </div>
            
            {/* Solution 2 */}
            <div className="solutions-card p-8 rounded-xl">
              <div className="solutions-icon text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faFileSignature} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Automated Tender Preparation</h3>
              <p className="text-gray-300">
                Our AI generates complete tender packages in minutes, ensuring compliance with all requirements while optimizing your bid for maximum success rate. Never miss a deadline again.
              </p>
              <div className="mt-6">
                <span className="inline-block bg-yellow-900 bg-opacity-30 text-yellow-300 px-3 py-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faRobot} className="mr-1" /> AI-Assisted
                </span>
              </div>
            </div>
            
            {/* Solution 3 */}
            <div className="solutions-card p-8 rounded-xl">
              <div className="solutions-icon text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faProjectDiagram} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Transparent Results Tracking</h3>
              <p className="text-gray-300">
                Every auction result is immutably recorded on blockchain with full asset tracking. See exactly where funds go and verify the integrity of every transaction in the process.
              </p>
              <div className="mt-6">
                <span className="inline-block bg-yellow-900 bg-opacity-30 text-yellow-300 px-3 py-1 rounded-full text-sm">
                  <FontAwesomeIcon icon={faLink} className="mr-1" /> Blockchain-Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button 
              className="gold-bg text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-600 transition flex items-center mx-auto"
              onClick={() => setShowJoinModal(true)}
            >
              <FontAwesomeIcon icon={faPaw} className="mr-2" /> Get Started With Our Solutions
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section - New Section */}
      <section id="how-it-works" className="py-20 dark-brown-bg" style={{ backgroundImage: `url(${howItWorksBg})`, backgroundSize: 'cover' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">HOW IT WORKS</h2>
            <div className="w-24 h-1 gold-bg mx-auto mb-6"></div>
            <p className="text-xl max-w-3xl mx-auto">
              Our streamlined process combines blockchain transparency with AI-powered efficiency to revolutionize auctions and tenders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Process Step 1 */}
            <div className="how-it-works-card p-8 rounded-xl">
              <div className="process-step">
                <div className="step-number">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ethereum-Based Deposits</h3>
                  <p className="text-gray-300">
                    All auction deposits are made on the Ethereum blockchain, ensuring transparency and security. Service providers maintain public profiles with categorization, allowing full visibility of fund allocation.
                  </p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI & ML Data Scraping</h3>
                  <p className="text-gray-300">
                    Our advanced AI and machine learning systems continuously scrape and analyze auction data relevant to your business, providing you with:
                  </p>
                  <ul className="mt-2 space-y-2 pl-6">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-2 text-sm" />
                      <span>Customized agreement templates</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-2 text-sm" />
                      <span>Market-average pricing benchmarks</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="gold-text mt-1 mr-2 text-sm" />
                      <span>Optimized time schedules for bidding</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Process Step 2 */}
            <div className="how-it-works-card p-8 rounded-xl">
              <div className="process-step">
                <div className="step-number">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Contract Execution</h3>
                  <p className="text-gray-300">
                    Once bids are submitted, smart contracts automatically execute when conditions are met, eliminating manual processing delays and ensuring fair, tamper-proof outcomes.
                  </p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">4</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Transparent Tracking</h3>
                  <p className="text-gray-300">
                    Every transaction is recorded on-chain with full asset tracking. Monitor fund flows in real-time and verify the integrity of every payment throughout the entire process.
                  </p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">5</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Continuous Optimization</h3>
                  <p className="text-gray-300">
                    Our system learns from each transaction, constantly improving recommendations for future bids based on historical success rates and market trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button className="border gold-border text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-900 hover:bg-opacity-20 transition flex items-center mx-auto">
              <FontAwesomeIcon icon={faPlayCircle} className="mr-2" /> Watch How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition/Tokenomics Section */}
      <section id="tokenomics" className="py-20 dark-brown-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">WHY MyCompanyDOGE?</h2>
            <div className="w-24 h-1 gold-bg mx-auto"></div>
            <p className="text-xl mt-6 max-w-2xl mx-auto">
              MyCompanyDOGE combines cutting-edge technology with a playful, approachable interface to deliver real value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tokenomics */}
            <div className="tokenomics-card p-8 rounded-xl text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faCoins} />
              </div>
              <h3 className="text-2xl font-bold mb-4">TOKENOMICS</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• Total Supply: 1B $MyCompanyDOGE</li>
                <li>• 5% Transaction Tax</li>
                <li>• 2% Redistribution</li>
                <li>• 2% Liquidity</li>
                <li>• 1% Burn</li>
              </ul>
            </div>
            
            {/* Roadmap */}
            <div className="tokenomics-card p-8 rounded-xl text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faMapMarkedAlt} />
              </div>
              <h3 className="text-2xl font-bold mb-4">ROADMAP</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• Q2 2025: Presale & Launch</li>
                <li>• Q3 2025: First DApp Release</li>
                <li>• Q1 2026: Mobile App Beta</li>
                <li>• Q2 2026: Enterprise Solutions</li>
                <li>• Q3 2026: Global Expansion</li>
              </ul>
            </div>
            
            {/* Partners */}
            <div className="tokenomics-card p-8 rounded-xl text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-2xl font-bold mb-4">PARTNERS & BACKERS</h3>
              <p className="text-gray-300">
                Strategic partnerships with leading blockchain infrastructure providers and productivity platforms.
              </p>
              <div className="flex justify-center mt-4 space-x-8 items-center">
                <EthereumIcon className="h-6 w-6 text-2xl" />
                <img 
                  src={stpLogo} 
                  alt="STP Logo" 
                  className="h-8" 
                />
              </div>
            </div>
            
            {/* Team */}
            <div className="tokenomics-card p-8 rounded-xl text-center">
              <div className="text-5xl gold-text mb-6">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-2xl font-bold mb-4">TEAM/ADVISORS</h3>
              <p className="text-gray-300">
                Experienced team of blockchain developers, AI experts, and business efficiency consultants.
              </p>
              <div className="mt-4">
                <button 
                  className="text-sm gold-text hover:underline"
                  onClick={() => setShowTeamModal(true)}
                >
                  Meet the Team →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black bg-opacity-70">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">READY TO UNLEASH YOUR INNER NINJA DOGE?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join the MyCompanyDOGE revolution today and start operating at peak efficiency.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="gold-bg text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-600 transition">
              $MyCompanyDOGE
            </button>
            <button 
              className="border gold-border text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-900 hover:bg-opacity-20 transition flex items-center justify-center"
              onClick={() => setShowJoinModal(true)}
            >
              <FontAwesomeIcon icon={faPaw} className="mr-2" /> Join Community
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 dark-brown-bg">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold gold-text">MyCompanyDOGE</h3>
              <p className="text-gray-400 mt-2">Sniffing waste since 2025</p>
            </div>
            
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="https://x.com/MyCompanyDOGE" className="text-gray-400 hover:text-yellow-300 text-xl">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 text-xl">
                <FontAwesomeIcon icon={faTelegram} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 text-xl">
                <FontAwesomeIcon icon={faDiscord} />
              </a>
              <a href="mailto:contact@mycompanydoge.com" className="text-gray-400 hover:text-yellow-300 text-xl">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 text-xl">
                <FontAwesomeIcon icon={faPhone} />
              </a>
            </div>
            
            <div className="text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} MyCompanyDOGE. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Team Modal */}
      {showTeamModal && (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 overflow-y-auto">
          <div className="modal-content bg-[#1A120B] m-auto mt-20 p-8 border-2 border-[#D4AF37] w-11/12 max-w-4xl rounded-lg relative animate-modalFadeIn">
            <span 
              className="close-btn absolute top-4 right-4 text-[#D4AF37] text-3xl font-bold cursor-pointer transition-all duration-300 hover:rotate-90 hover:text-white"
              onClick={() => setShowTeamModal(false)}
            >
              &times;
            </span>
            <h2 className="text-3xl font-bold mb-6 gold-text text-center">Meet Our Team</h2>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-4">Why are we the ones to do it?</h3>
              <p className="text-gray-300 mb-6">
                Successfully launched over twelve blockchain projects in past 8 years. Team of Ethereum and Solana developers. 
                Preaching blockchain and making events is our hidden side.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member flex flex-col items-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-3 border-[#D4AF37] mb-4" 
                  />
                  <h4 className="text-xl font-bold">{member.name}</h4>
                  <p className="text-gray-400">{member.title}</p>
                  <p className="text-sm text-gray-300 mt-2 text-center">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 overflow-y-auto">
          <div className="modal-content bg-[#1A120B] m-auto mt-20 p-8 border-2 border-[#D4AF37] w-11/12 max-w-md rounded-lg relative animate-modalFadeIn">
            <span 
              className="close-btn absolute top-4 right-4 text-[#D4AF37] text-3xl font-bold cursor-pointer transition-all duration-300 hover:rotate-90 hover:text-white"
              onClick={() => setShowJoinModal(false)}
            >
              &times;
            </span>
            <h2 className="text-3xl font-bold mb-6 gold-text text-center">Join Our Community</h2>
            <p className="text-gray-300 text-center mb-8">
              Fill out the form below to join the MyCompanyDOGE community and stay updated with our latest news and updates.
            </p>
            
            <form className="join-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input bg-black bg-opacity-30 border border-gray-700 text-white p-3 rounded-lg w-full mb-4 focus:border-[#D4AF37] focus:outline-none focus:shadow-outline-gold" 
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input bg-black bg-opacity-30 border border-gray-700 text-white p-3 rounded-lg w-full mb-4 focus:border-[#D4AF37] focus:outline-none focus:shadow-outline-gold" 
                  placeholder="Your Email" 
                  required 
                />
              </div>
              <div className="mb-6">
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input bg-black bg-opacity-30 border border-gray-700 text-white p-3 rounded-lg w-full mb-4 focus:border-[#D4AF37] focus:outline-none focus:shadow-outline-gold" 
                  rows="4" 
                  placeholder="Tell us why you want to join our community"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="form-submit bg-[#D4AF37] text-black border-none p-3 rounded-lg font-bold cursor-pointer transition-all duration-300 hover:bg-yellow-600 hover:transform hover:-translate-y-1 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPaw} className="mr-2" /> Send Application
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-400">
              We'll send you updates about MyCompanyDOGE to your email
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for Modal Animation */}
      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-modalFadeIn {
          animation: modalFadeIn 0.4s ease-out;
        }

        .gold-text {
          color: #D4AF37;
        }
        
        .gold-border {
          border-color: #D4AF37;
        }
        
        .gold-bg {
          background-color: #D4AF37;
        }
        
        .dark-brown-bg {
          background-color: #1A120B;
        }
        
        .feature-card, .solutions-card, .how-it-works-card, .tokenomics-card {
          transition: all 0.3s ease;
          border: 1px solid #333;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
          border-color: #D4AF37;
        }

        .solutions-card {
          background: linear-gradient(145deg, #1A120B 0%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
        }
        
        .solutions-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
        
        .solutions-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #D4AF37;
          transition: all 0.3s ease;
        }
        
        .solutions-card:hover::before {
          width: 100%;
          opacity: 0.1;
        }
        
        .solutions-icon {
          transition: all 0.3s ease;
        }
        
        .solutions-card:hover .solutions-icon {
          transform: scale(1.1);
        }

        .how-it-works-card {
          background: linear-gradient(145deg, #1A120B 0%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
        }
        
        .how-it-works-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
        
        .how-it-works-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #D4AF37;
          transition: all 0.3s ease;
        }
        
        .how-it-works-card:hover::before {
          width: 100%;
          opacity: 0.1;
        }
        
        .step-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-color: #D4AF37;
          color: #000;
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          font-weight: bold;
          margin-right: 15px;
        }
        
        .process-step {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }
        
        .process-step:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .tokenomics-card {
          background: linear-gradient(145deg, #1A120B 0%, #0a0a0a 100%);
          transition: all 0.3s ease;
        }
        
        .tokenomics-card:hover {
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }
        
        .model-container {
          perspective: 1000px;
        }
        
        .model-3d {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(10deg); }
          100% { transform: translateY(0px) rotateY(0deg); }
        }
        
        .ninja-mode {
          position: relative;
          overflow: hidden;
        }
        
        .ninja-mode::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%);
          animation: rotate 20s linear infinite;
          z-index: 0;
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .nav-link {
          position: relative;
          padding: 8px 0;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #D4AF37;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .join-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(212, 175, 55, 0.2);
        }
        
        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(212, 175, 55, 0.3);
        }
        
        .join-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: all 0.5s ease;
        }
        
        .join-btn:hover::before {
          left: 100%;
        }
        
        /* Mobile Menu Styles */
        .mobile-menu-enter {
          opacity: 0;
          transform: translateY(-10px);
        }
        
        .mobile-menu-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        
        .mobile-menu-exit {
          opacity: 1;
        }
        
        .mobile-menu-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 300ms, transform 300ms;
        }
        
        /* Mobile wallet button styling */
        .mobile-wallet-btn button {
          width: 100%;
          height: auto;
          padding: 12px 16px;
          border-radius: 9999px;
          border: 1px solid #D4AF37;
          background-color: transparent;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-wallet-btn button:hover {
          background-color: rgba(212, 175, 55, 0.2);
        }
      `}</style>
      

      
      {/* DOGEAssist Integration */}
      <DOGEAssist />
    </div>
  );
}