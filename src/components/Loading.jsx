const Loading = () => {
    return (
      <div className="relative flex items-center justify-center h-20 w-20">
        {/* Subtle glow background */}
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-lg animate-pulse"></div>
  
        {/* Clean spinning ring */}
        <div className="absolute animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 border-r-blue-500"></div>
  
        {/* Stylish center circle with large 'T' */}
        <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg">
          <span className="text-blue-600 font-extrabold text-2xl font-serif select-none">T</span>
        </div>
      </div>
    );
  };
  
  export default Loading;
  