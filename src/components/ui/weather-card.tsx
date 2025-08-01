import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, Zap, Snowflake, CloudFog, Wind, Eye, MapPin } from 'lucide-react';

interface ApiConfig {
    key: string;
    base: string;
    geo: string;
}

const api: ApiConfig = {
    key: '8b1b19048af0123ba0f41fbd713fad0c',
    base: 'https://api.openweathermap.org/data/2.5/',
    geo: 'https://api.openweathermap.org/geo/1.0/'
}

interface CityResult {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

const WeatherCard: React.FC = () => {
    const [search, setSearch] = useState<string>("")
    const [weather, setWeather] = useState<any>({
        "coord": {
            "lon": -0.1257,
            "lat": 51.5085
        },
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 22.49,
            "feels_like": 22.02,
            "temp_min": 22.49,
            "temp_max": 22.49,
            "pressure": 1019,
            "humidity": 47,
            "sea_level": 1019,
            "grnd_level": 1015
        },
        "visibility": 10000,
        "wind": {
            "speed": 2.93,
            "deg": 297,
            "gust": 5.98
        },
        "clouds": {
            "all": 92
        },
        "dt": 1753725020,
        "sys": {
            "country": "GB",
            "sunrise": 1753676299,
            "sunset": 1753732527
        },
        "timezone": 3600,
        "id": 2643743,
        "name": "London",
        "cod": 200
    })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<CityResult[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Create ref for the search container
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        // Add event listener when suggestions are shown
        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSuggestions]);

    // Fetch city suggestions from API
    const fetchCitySuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoadingSuggestions(true);
        try {
            const response = await fetch(
                `${api.geo}direct?q=${query}&limit=5&appid=${api.key}`
            );
            const cities: CityResult[] = await response.json();
            setSuggestions(cities);
            setShowSuggestions(cities.length > 0);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Debounce API calls to avoid too many requests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCitySuggestions(search);
        }, 300); // Wait 300ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleSearch = () => {
        if (!search.trim()) {
            setError("Please enter a valid city name");
            return;
        }

        setLoading(true);
        setError("");
        setShowSuggestions(false);

        fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}`)
            .then(res => res.json())
            .then((result) => {
                setLoading(false);
                if (result.cod === 200) {
                    setWeather(result);
                    console.log("Weather data:", result);
                    setError("");
                } else {
                    setError("Weather data not available. Please enter a valid city name.");
                    setWeather({});
                }
            })
            .catch(() => {
                setLoading(false);
                setError("Weather data not available. Please try again.");
                setWeather({});
            });
    }

    const handleSuggestionClick = (city: CityResult) => {
        setSearch(city.name);
        setShowSuggestions(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setError("");
    }

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    const getWeatherIcon = (main: string) => {
        switch (main?.toLowerCase()) {
            case 'clear':
                return <Sun className="w-20 h-20 text-yellow-300" />;
            case 'clouds':
                return <Cloud className="w-20 h-20 text-gray-300" />;
            case 'rain':
                return <CloudRain className="w-20 h-20 text-blue-300" />;
            case 'drizzle':
                return <CloudDrizzle className="w-20 h-20 text-blue-400" />;
            case 'thunderstorm':
                return <Zap className="w-20 h-20 text-purple-300" />;
            case 'snow':
                return <Snowflake className="w-20 h-20 text-white" />;
            case 'mist':
            case 'fog':
            case 'haze':
                return <CloudFog className="w-20 h-20 text-gray-300" />;
            case 'smoke':
            case 'dust':
            case 'sand':
                return <Wind className="w-20 h-20 text-orange-300" />;
            default:
                return <Sun className="w-20 h-20 text-yellow-300" />;
        }
    };

    // Get background gradient based on weather
    const getWeatherBackground = (main: string) => {
        switch (main?.toLowerCase()) {
            case 'clear':
                return 'bg-gradient-to-b from-amber-400/40 via-yellow-300/20 to-transparent';
            case 'clouds':
                return 'bg-gradient-to-b from-gray-500/40 via-gray-400/20 to-transparent';
            case 'rain':
                return 'bg-gradient-to-b from-blue-600/40 via-blue-400/20 to-transparent';
            case 'drizzle':
                return 'bg-gradient-to-b from-blue-400/40 via-blue-300/20 to-transparent';
            case 'thunderstorm':
                return 'bg-gradient-to-b from-purple-700/40 via-purple-500/20 to-transparent';
            case 'snow':
                return 'bg-gradient-to-b from-sky-300/40 via-blue-100/20 to-transparent';
            case 'mist':
            case 'fog':
            case 'haze':
                return 'bg-gradient-to-b from-gray-500/40 via-gray-300/20 to-transparent';
            case 'smoke':
            case 'dust':
            case 'sand':
                return 'bg-gradient-to-b from-orange-500/40 via-amber-400/20 to-transparent';
            default:
                return 'bg-gradient-to-b from-amber-400/40 via-yellow-300/20 to-transparent';
        }
    };

    return (
        <div className="p-5 rounded-3xl">
            {/* Search Section */}
            <div className="mb-5">
                <h3 className="text-white text-center mb-2 text-2xl font-semibold drop-shadow-md">
                    Weather Search
                </h3>

                <div ref={searchContainerRef} className="relative">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder="Search for a city"
                            value={search}
                            onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                            className="flex-1 px-4 h-8 rounded-xl bg-white/10 text-white text-sm outline-none placeholder:text-sm placeholder-white/70"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className={`px-6 rounded-xl text-white text-sm transition-all duration-300 ${
                                loading 
                                    ? 'bg-gray-500/30 cursor-not-allowed' 
                                    : 'bg-white/10 cursor-pointer hover:bg-white/20'
                            }`}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] max-h-48 overflow-y-auto z-50 ">
                            {loadingSuggestions ? (
                                <div className="px-5 py-4 text-white/80">
                                    Loading suggestions...
                                </div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((city, index) => (
                                    <div
                                        key={`${city.name}-${city.country}-${index}`}
                                        onClick={() => handleSuggestionClick(city)}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className={`px-5 py-4 cursor-pointer flex items-center transition-colors duration-200 ${
                                            index < suggestions.length - 1 ? 'border-b border-white/10' : ''
                                        } ${hoveredIndex === index ? 'bg-white/10' : ''}`}
                                    >
                                        <MapPin className="w-4 h-4 mr-3 text-white/70" />
                                        <div>
                                            <div className="text-white font-medium">{city.name}</div>
                                            <div className="text-xs text-white/70">
                                                {city.state ? `${city.state}, ` : ''}{city.country}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-4 text-white/70">
                                    No cities found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-xl mb-5 border border-red-500/30">
                    <p className="m-0">{error}</p>
                </div>
            )}

            {/* Weather Display */}
            {weather.name && !error && (
                <div className={`${weather.name ? getWeatherBackground(weather.weather?.[0]?.main) : 'bg-gradient-to-br from-white/10 to-white/5'} backdrop-blur-2xl rounded-3xl p-3 border border-white/20`}>
                    {/* Location */}
                    <div className="flex items-center justify-center mb-2 pt-2">
                        <MapPin className="w-5 h-5 mr-3 text-white/80" />
                        <h2 className="text-white m-0 text-xl font-semibold drop-shadow-md">
                            {weather.name}
                        </h2>
                    </div>

                    {/* Main Weather */}
                    <div className="flex items-center justify-center gap-5">
                        {getWeatherIcon(weather.weather?.[0]?.main)}
                        <div className="text-center">
                            <div className="text-5xl text-center font-bold text-white drop-shadow-md leading-none">
                                {Math.round(weather.main?.temp)}°C
                            </div>
                            
                        </div>
                    </div>
                    <div className="text-lg text-center text-white/90 font-medium">
                                {weather.weather?.[0]?.main}
                            </div>

                    {/* Weather Description */}
                    <div className="text-center mb-2 text-white/80 text-base capitalize">
                        {weather.weather?.[0]?.description}
                    </div>

                    {/* Additional Info */}
                    <div className="flex justify-around gap-5 flex-wrap">
                        <div className="flex items-center px-5 py-3">
                            <Eye className="w-4 h-4 mr-2 text-white/80" />
                            <div>
                                <div className="text-xs text-white/70">
                                    Visibility
                                </div>
                                <div className="text-xs text-white font-semibold">
                                    {(weather.visibility / 1000).toFixed(1)}km
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center px-5 py-3 rounded-2xl">
                            <Wind className="w-4 h-4 mr-2 text-white/80" />
                            <div>
                                <div className="text-xs text-white/70">
                                    Wind Speed
                                </div>
                                <div className="text-xs text-white font-semibold">
                                    {weather.wind?.speed}m/s
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WeatherCard