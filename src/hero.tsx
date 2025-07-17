export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Website</h1>
            <p className="text-lg mb-8">Your journey to excellence starts here.</p>
            <button className="px-6 py-3 bg-white text-blue-700 rounded-full shadow-lg hover:bg-gray-100 transition">
                Get Started
            </button>
        </div>
    );
}