import React from 'react';
import { FaFilter } from "react-icons/fa";
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';

// Fake attraction data
const attractions = [
    {
        id: 1,
        name: "Sigiriya Rock Fortress",
        image: "https://media.istockphoto.com/id/1146786448/photo/aerial-view-from-above-of-sigiriya-or-the-lion-rock-an-ancient-fortress-and-a-palace-with.jpg?s=1024x1024&w=is&k=20&c=ubzO1vUV3kEmaLIyKyPVqEjsxmEDAerySH47gVKVCzc=",
        description: "An ancient rock fortress and palace built atop a massive rock column."
    },
    {
        id: 2,
        name: "Temple of the Tooth",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIXEl_uABYQcfRlvkgHFD__qhYCx5zNFoWIw&s",
        description: "A sacred Buddhist temple in Kandy that houses a relic of Buddha's tooth, attracting pilgrims and tourists from around the world."
    },
    {
        id: 3,
        name: "Yala National Park",
        image: "https://media.istockphoto.com/id/481413705/photo/leopard-and-prey.jpg?s=612x612&w=0&k=20&c=Z9g4mMHYbX24k8La1DUwbCM4XP88iuKGjLA2pMR34y0=",
        description: "A wildlife sanctuary home to leopards, elephants, and exotic birds."
    },
    {
        id: 4,
        name: "Galle Fort",
        image: "https://media.gettyimages.com/id/1150415140/photo/galle-dutch-fort-galle-fort-sri-lanka-aerial-view.jpg?s=612x612&w=0&k=20&c=lCrA83_sQHMnruxdHqUy4QhnWNJgCcQ6s__F9L-kh54=",
        description: "A historic Dutch fort with stunning architecture and ocean views."
    },
    {
        id: 5,
        name: "Ella Rock",
        image: "https://media.gettyimages.com/id/812558438/photo/little-adams-peak-in-ella.jpg?s=612x612&w=0&k=20&c=dnTZSXhBBG2CV2JwrS2rfUNxOiHlaC4nVHC1DU8FXmw=",
        description: "A scenic hiking spot with breathtaking views of Sri Lanka’s landscape."
    }
];

export default function Attractions() {
    return (
        <div className='bg-gray-100'>
            <TopAppBar />

            {/* Search Bar & Filter Section */}
            <div className="pt-24 p-4 max-w-5xl mx-auto">
                <div className="flex items-center bg-white shadow-md p-2 rounded-lg border border-gray-300">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search attractions..."
                        className="w-full p-2 focus:outline-none"
                    />

                    {/* Filter Button on the Right */}
                    <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                        <FaFilter className="text-gray-600 text-xl" />
                    </button>
                </div>

                {/* Suggested Attractions (Horizontal Scroll - One Card at a Time) */}
                <h1 className="text-2xl font-bold my-6 text-center">Suggested Attractions</h1>
                <div className="overflow-x-auto pb-4">
                    <div className="flex space-x-4">
                        {attractions.slice(0, 3).map((attraction) => (
                            <div
                                key={attraction.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 w-80 flex-shrink-0"
                            >
                                <img
                                    src={attraction.image}
                                    alt={attraction.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className='absolute top-[0] right-[0] px-[8px] py-[4px] bg-[#fff] m-[8px] rounded-[8px] text-[#534f4f]' >
                                    Hidden gem
                                </div>
                                <div className="p-3">
                                    <h2 className="text-lg font-semibold">{attraction.name}</h2>
                                    <p className="text-gray-600 text-sm">{attraction.description.substring(0, 80)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Attractions */}
                <h1 className="text-2xl font-bold mt-10 mb-4 text-center">All Attractions</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attractions.map((attraction) => (
                        <div
                            key={attraction.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        >
                            <img
                                src={attraction.image}
                                alt={attraction.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                                <h2 className="text-lg font-semibold">{attraction.name}</h2>
                                <p className="text-gray-600 text-sm">{attraction.description.substring(0, 80)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomTabBar />
        </div>
    );
}
