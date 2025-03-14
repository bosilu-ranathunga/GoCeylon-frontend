import React from 'react'
import TopAppBar from '../../components/TopAppBar'
import BottomTabBar from '../../components/BottomTabBar'

const AttractionsList = () => {
    const navigate = useNavigate();}

    // Fake attraction data with working Pixabay images
    const attractions = [
        {
            id: 1,
            name: "Sigiriya Rock Fortress",
            image: "https://cdn.pixabay.com/photo/2017/09/04/06/56/sigiriya-2714105_1280.jpg",
            description: "An ancient rock fortress and palace built atop a massive rock column."
        },
        {
            id: 2,
            name: "Temple of the Tooth",
            image: "https://cdn.pixabay.com/photo/2018/12/01/13/36/sri-lanka-3848706_1280.jpg",
            description: "A sacred Buddhist temple in Kandy that houses a relic of Buddha's tooth."
        },
        {
            id: 3,
            name: "Yala National Park",
            image: "https://cdn.pixabay.com/photo/2020/01/06/21/01/safari-4745351_1280.jpg",
            description: "A wildlife sanctuary home to leopards, elephants, and exotic birds."
        },
        {
            id: 4,
            name: "Galle Fort",
            image: "https://cdn.pixabay.com/photo/2017/10/18/14/34/galle-2864659_1280.jpg",
            description: "A historic Dutch fort with stunning architecture and ocean views."
        },
        {
            id: 5,
            name: "Ella Rock",
            image: "https://cdn.pixabay.com/photo/2019/08/20/07/46/train-4417685_1280.jpg",
            description: "A scenic hiking spot with breathtaking views of Sri Lanka’s landscape."
        }
    ];



export default function Attractions() {
    return (
        <>
            <TopAppBar />
            <div className="pt-24 p-4 max-w-5xl mx-auto">
            {/* Suggested Attractions */}
            <h1 className="text-2xl font-bold mb-4 text-center">Suggested Attractions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attractions.slice(0, 3).map((attraction) => (
                    <div
                        key={attraction.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/attractions/${attraction.id}`)}
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

            {/* All Attractions */}
            <h1 className="text-2xl font-bold mt-10 mb-4 text-center">All Attractions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attractions.map((attraction) => (
                    <div
                        key={attraction.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/attractions/${attraction.id}`)}
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
        </>
    )
}
