// components/Search/SearchModal.tsx
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsernames([]);
      setError("");
      return;
    }

    const fetchUsernames = async () => {
      setLoading(true);
      setError("");
      try {
        // CORRECTED ENDPOINT URL
        const url = `http://localhost:5000/api/users/search-usernames?query=${encodeURIComponent(searchQuery)}`;
        
        const response = await fetch(url, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setUsernames(data.users.map((user: any) => user.username));
        } else {
          setError(data.message || "No results found");
        }
      } catch (error) {
        console.error("Network error:", error);
        setError("Failed to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsernames, 300);
    return () => clearTimeout(timer);
  },  [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
      <div 
        className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 p-4 flex items-center">
          <h2 className="text-xl font-bold flex-grow text-center">Search</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search usernames"
              className="w-full bg-zinc-800 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {/* Error Message */}
            {error && (
              <div className="text-red-500 p-3 text-center">
                {error}
              </div>
            )}
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 text-gray-500">
                Searching...
              </div>
            )}
            
            {/* Search Results */}
            {!loading && !error && searchQuery && usernames.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No matching usernames found
              </div>
            )}
            
            {!loading && !error && usernames.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-semibold text-gray-400 mb-2 px-2">Results</h3>
                {usernames.map((username, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      console.log("Selected username:", username);
                      onClose();
                    }}
                  >
                    <div className="font-semibold">{username}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Recent Searches */}
            {!loading && !error && !searchQuery && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-2">Recent</h3>
                <div className="text-center py-8 text-gray-500">
                  <p>No recent searches.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}