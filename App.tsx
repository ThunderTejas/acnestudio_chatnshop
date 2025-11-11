import React, { useState, useRef, useEffect, createContext, useContext, ReactNode } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";


// --- ICONS ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const AccountIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const BagIcon = () => (
    <svg 
        className="h-4 w-4"
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
    >
        <path d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 7V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- PRODUCT & CART MANAGEMENT ---
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (item: Product) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}
// FIX: Changed props type from custom interface to { children: ReactNode } to resolve TS error.
const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const addToCart = (item: Product) => {
    if (!cartItems.find(cartItem => cartItem.id === item.id)) {
      setCartItems(prevItems => [...prevItems, item]);
      alert(`${item.name} added to cart!`);
    } else {
      alert(`${item.name} is already in the cart.`);
    }
  };
  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// --- STATIC PAGE COMPONENTS ---
const images = [
  { src: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw872f5fca/home/2025/w45/gift-w-d.jpg', alt: 'A person in a light-colored outfit, including a top, pants, and a large scarf, stands against a plain background, looking towards the right.' },
  { src: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw42cee0c0/home/2025/w45/gift-m-d.jpg', alt: 'A person wearing a dark beanie, a patterned scarf, a dark jacket, and light-colored pants stands against a plain background, looking slightly to the left.' },
  { src: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw2a3d9976/home/2025/w45/shop-woman-d.jpg', alt: 'A woman wearing a white top and a long white skirt, with her back facing the camera.' },
  { src: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw7cd4546f/home/2025/w45/shop-man-d.jpg', alt: 'A man wearing a dark jacket over a light shirt, standing and looking to his right.' },
];
const products = [
  { title: "WOMEN'S JEANS > SHOP NOW", imageUrl: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw0147d541/home/2024/keycat/01.jpg', alt: "A pair of dark, wide-leg women's jeans." },
  { title: 'BAGS', imageUrl: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dwb72e9fca/home/2024/keycat/02.jpg', alt: 'A black leather handbag with knotted details on the sides.' },
  { title: 'SCARVES', imageUrl: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dwab123175/home/2024/keycat/03.jpg', alt: 'A fuzzy mohair scarf with a green and blue checkered pattern.' },
  { title: "MEN'S JEANS", imageUrl: 'https://www.acnestudios.com/on/demandware.static/-/Library-Sites-acne/default/dw002717ea/home/2024/keycat/04.jpg', alt: "A pair of light-wash, distressed men's jeans with rips on the knees." },
];
const infoItems = [
  { imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAXV_PRD/on/demandware.static/-/Library-Sites-acne/default/dwe38ffa0d/home/2025/UVP/shipping.jpg?sw=640', title: 'SHIPPING & RETURNS', description: 'Fast delivery and easy returns or exchanges on all orders.', alt: 'Pink Acne Studios boxes.' },
  { imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAXV_PRD/on/demandware.static/-/Library-Sites-acne/default/dwe73605a2/home/2025/UVP/palais-royal-ex3.jpg?sw=640', title: 'ACNE PAPER PALAIS ROYAL', description: 'A permanent gallery by Acne Studios, merging fashion, art, and publishing beneath the arcades of Palais Royal.', alt: 'An Acne Paper store front with sculptures in the window.' },
  { imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAXV_PRD/on/demandware.static/-/Library-Sites-acne/default/dw4bb5e44c/home/2025/UVP/giftcard-02.jpg?sw=640', title: 'GIFT CARD', description: 'Acne Studios digital gift cards are delivered instantly by email, redeemable online and in store.', alt: 'An illustration of a building with a large gift bow on it.' },
  { imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAXV_PRD/on/demandware.static/-/Library-Sites-acne/default/dwbfe12888/home/2025/UVP/ss26.jpg?sw=640', title: 'SS26 RUNWAY', description: "Acne Studios presents Women's Spring/Summer 2026. Launching online and in stores March 2026.", alt: 'A model walking down a runway in a golden-brown outfit.' },
  { imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAXV_PRD/on/demandware.static/-/Library-Sites-acne/default/dw87e20a99/home/2025/UVP/store.jpg?sw=640', title: 'DISCOVER OUR STORES', description: 'Explore our store locator to discover your nearest Acne Studios destination.', alt: 'An exterior view of a modern Acne Studios store.' }
];
const ProductShowcase: React.FC = () => (
    <section className="bg-gray-100 w-full p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 font-sans">
            {products.map((product, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="w-full text-center sm:text-left py-4"><a href="#" className="text-xs uppercase tracking-widest hover:opacity-70 transition-opacity text-black">{product.title}</a></div>
                    <a href="#"><img src={product.imageUrl} alt={product.alt} className="w-full h-auto object-contain" loading="lazy"/></a>
                </div>
            ))}
        </div>
    </section>
);
const InfoSection: React.FC = () => (
    <section className="bg-white w-full p-4 sm:p-8 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {infoItems.map((item, index) => (
                <div key={index}>
                    <a href="#"><img src={item.imageUrl} alt={item.alt} className="w-full h-auto mb-4" loading="lazy"/></a>
                    <h3 className="text-xs text-black font-semibold uppercase tracking-wider mb-2"><a href="#" className="hover:opacity-70 transition-opacity">{item.title}</a></h3>
                    <p className="text-sm text-black">{item.description}</p>
                </div>
            ))}
        </div>
    </section>
);
const Footer: React.FC = () => (
    <footer className="bg-white text-black font-sans px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-end mb-12">
                <div className="w-full lg:w-2/5">
                    <h3 className="text-xs font-semibold tracking-widest mb-2">NEWSLETTER</h3>
                    <p className="text-sm text-gray-600 mb-4">Receive news about Acne Studios collections, Acne Paper, events and sales.</p>
                    <form><input type="email" placeholder="EMAIL" className="w-full bg-gray-100 p-3 text-xs tracking-widest placeholder-gray-500 focus:outline-none" aria-label="Email for newsletter"/></form>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest mb-4">CONTACT US</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Live chat <span className="text-green-600 text-xs">Available</span></a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Call <span className="text-green-600 text-xs">Available</span></a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Email</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest mb-4">HELP</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Contact us</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Order status</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Register a return</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">FAQs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest mb-4">CLIENT SERVICES</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Acne Studios Services</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Account</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Find a store</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Product care</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Gift Cards</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest mb-4">COMPANY</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">About</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Press</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Careers</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Sustainability</a></li>
                            <li><a href="#" className="text-black hover:opacity-70 transition-opacity">Legal & Privacy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs tracking-widest">
                <p className="mb-4 sm:mb-0">&copy; 2025 ACNE STUDIOS</p>
                <div className="flex space-x-4 mb-4 sm:mb-0"><span>IG</span><span>FB</span><span>TW</span><span>YT</span><span>PT</span><span>WB</span></div>
                <a href="#" className="text-black hover:opacity-70 transition-opacity">SHIPPING TO INDIA (ENGLISH)</a>
            </div>
        </div>
    </footer>
);


// --- HEADER COMPONENT ---
interface HeaderProps {
  onNavigate: (page: 'home' | 'chat' | 'cart' | 'checkout') => void;
  currentPage: 'home' | 'chat' | 'cart' | 'checkout';
}
const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { cartItems } = useCart();
  const navLinks = ['Woman', 'Man', 'Bags', 'Scarves', 'Gifts'];

  return (
    <div className="bg-white sticky top-0 z-30">
      <header className="text-black w-full font-sans">
        <nav className="relative flex items-center justify-between p-4 px-6 text-xs uppercase tracking-widest">
          {/* Left Side */}
          <div className="flex items-center space-x-6">
           <div className="md:hidden"><button aria-label="Open menu"><svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div>
           <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (<a key={link} href="#" className="hover:opacity-70 transition-opacity">{link}</a>))}
              <button onClick={() => onNavigate('chat')} className="font-sans text-xs uppercase tracking-widest bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors">Chat & Shop</button>
           </div>
          </div>

          {/* Middle for non-home pages */}
          {currentPage !== 'home' && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="font-bold text-2xl" 
                    style={{fontFamily: "'Permanent Marker', cursive"}}
                >
                    Acne Studios
                </button>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <a href="#" className="flex items-center space-x-2 hover:opacity-70 transition-opacity"><SearchIcon /><span>Search</span></a>
            <a href="#" className="hidden md:flex items-center space-x-2 hover:opacity-70 transition-opacity"><HelpIcon /><span>Help</span></a>
            <a href="#" className="hidden md:flex items-center space-x-2 hover:opacity-70 transition-opacity"><AccountIcon /><span>Account</span></a>
            <button onClick={() => onNavigate('cart')} className="flex items-center space-x-2 hover:opacity-70 transition-opacity relative">
              <BagIcon />
              <span>{cartItems.length.toString().padStart(2, '0')}</span>
              {cartItems.length > 0 && <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{cartItems.length}</span>}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

// --- PAGE COMPONENTS ---

const HomePage: React.FC = () => {
    const [currentFont, setCurrentFont] = useState("'Crayon Crumble', cursive");
    const [isTextVisible, setIsTextVisible] = useState(false);
    const firstImageRef = useRef<HTMLImageElement>(null);
    const secondImageRef = useRef<HTMLImageElement>(null);
    const fourthImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleScroll = () => {
          if (firstImageRef.current && secondImageRef.current && fourthImageRef.current) {
            const firstImageTop = firstImageRef.current.getBoundingClientRect().top;
            const firstRowBottom = secondImageRef.current.getBoundingClientRect().bottom;
            const fourthImageBottom = fourthImageRef.current.getBoundingClientRect().bottom;
            const viewportCenter = window.innerHeight / 2;
            setIsTextVisible(firstImageTop < viewportCenter && fourthImageBottom > viewportCenter);
            if (firstRowBottom > viewportCenter) {
              setCurrentFont("'Crayon Crumble', cursive");
            } else {
              setCurrentFont("'Permanent Marker', cursive");
            }
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-opacity duration-300 pointer-events-none ${isTextVisible ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: currentFont, transition: 'font-family 0.3s ease-in-out' }} aria-hidden={!isTextVisible}>
                <h1 className="text-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl whitespace-nowrap">Acne Studios</h1>
            </div>
            <main className="grid grid-cols-1 md:grid-cols-2 bg-white">
                {images.map((image, index) => <img ref={index === 0 ? firstImageRef : index === 1 ? secondImageRef : index === 3 ? fourthImageRef : null} key={index} src={image.src} alt={image.alt} className="w-full h-auto object-contain" loading="lazy"/>)}
            </main>
            <ProductShowcase />
            <InfoSection />
            <Footer />
        </>
    );
};

const ChatPage: React.FC = () => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Thinking...');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text?: string; products?: Product[] }[]>([
    { sender: 'ai', text: "Hello! How can I help you find the perfect item today? Ask for anything, like 'Show me a wool scarf' or 'I need some vintage-looking jeans'." }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLoadingMessage('Coming up with ideas...');

    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyBcQxmCBAuJRhnAVT4mGg6u6r-0TV5Scdo" }); // to be changed
      
      const textGenSchema = {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique product ID, e.g., prod_xyz" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.STRING, description: "Price in USD, e.g., $350" },
                imagePrompt: { type: Type.STRING, description: "A detailed, photorealistic prompt for an image generation model. Describe the product on a mannequin or flat lay against a studio background." }
              },
              required: ["id", "name", "description", "price", "imagePrompt"]
            }
          }
        },
        required: ["products"]
      };

      const systemInstruction = "You are a creative shopping assistant for the luxury fashion brand Acne Studios. Based on the user's request, generate 1 to 2 unique and realistic product ideas that fit the brand's aesthetic. For each product, provide a unique ID, a compelling name, a brief description, a realistic price in USD, and a detailed, photorealistic image generation prompt. The image prompt should describe the item professionally, as if for a product catalog (e.g., on a mannequin or a flat lay shot against a clean studio background). You MUST respond ONLY with a valid JSON object matching the required schema. If the user's request is unclear or inappropriate, return an empty 'products' array.";
      
      const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage.text,
        config: { systemInstruction, responseMimeType: "application/json", responseSchema: textGenSchema }
      });

      const resultJson = JSON.parse(textResponse.text.trim());
      const generatedProducts = resultJson.products;

      if (generatedProducts && generatedProducts.length > 0) {
        setLoadingMessage('Creating product images...');

        const productsWithImages = await Promise.all(
            generatedProducts.map(async (product: any) => {
                const imageResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: product.imagePrompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                let imageUrl = 'https://via.placeholder.com/640x800.png?text=Image+Not+Found';
                for (const part of imageResponse.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    }
                }
                
                return { ...product, imageUrl };
            })
        );
        setMessages(prev => [...prev, { sender: 'ai', products: productsWithImages }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: "I couldn't come up with anything for that. Could you try being more specific?" }]);
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble searching for products right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white font-sans">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.products && (
                <div className="space-y-4">
                  <p>Here are some ideas I came up with for you:</p>
                  {msg.products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md p-3 text-black">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-2" />
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-black mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">{product.price}</span>
                        <button onClick={() => addToCart(product)} className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors">Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="max-w-lg p-3 rounded-lg bg-gray-200 text-black">{loadingMessage}</div></div>}
        <div ref={chatEndRef} />
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Describe what you're looking for..." className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          <button onClick={handleSendMessage} disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors">Send</button>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<{ onNavigate: (page: 'home' | 'chat' | 'cart' | 'checkout') => void; }> = ({ onNavigate }) => {
    const { cartItems } = useCart();
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
    return (
        <div className="container mx-auto p-4 sm:p-8 font-sans">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4"/>
                                <div className="flex-1">
                                    <h2 className="font-bold text-lg">{item.name}</h2>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                                <p className="font-semibold text-lg">{item.price}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg h-fit">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <button onClick={() => onNavigate('checkout')} className="w-full bg-black text-white py-3 mt-6 rounded-md hover:bg-gray-800 transition-colors">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CheckoutPage: React.FC = () => (
    <div className="container mx-auto p-4 sm:p-8 text-center font-sans">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg">Your order has been placed. Thank you for shopping with us.</p>
    </div>
);

// --- APP ROUTER ---
const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'cart' | 'checkout'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'chat': return <ChatPage />;
      case 'cart': return <CartPage onNavigate={setCurrentPage} />;
      case 'checkout': return <CheckoutPage />;
      case 'home':
      default: return <HomePage />;
    }
  };

  return (
    <CartProvider>
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </CartProvider>
  );
};

export default App;
