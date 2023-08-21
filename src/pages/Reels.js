import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Reels() {

    const [formData, setFormData] = useState({
        businessName: '',
        textContent: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        // Call the API or handle the form data to generate the reel
        console.log(formData);
        // Simulate video generation
        setTimeout(() => {
            // Update state to display video slot and download button
        }, 2000);
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            
            {/* Header */}
            <header className="bg-pink-600 text-white py-4 px-6 shadow-md">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-lg font-bold tracking-wide">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Home
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <main className="p-10 flex-grow">
                <h1 className="text-3xl font-bold mb-6">Generate Your Reel with AI</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Provide the text content and our AI will craft the perfect reel for your brand.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessName">
                            Business Name
                        </label>
                        <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textContent">
                            Text Content for the Reel
                        </label>
                        <textarea id="textContent" name="textContent" rows="6" value={formData.textContent} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Generate Reel
                        </button>
                    </div>
                </form>

                {/* This section is displayed once the video is generated */}
                {/* Assuming the video is generated and stored in a variable called `generatedReel` */}
                {/* Uncomment the below section when the video is ready */}
                {/*
                <div className="mt-10">
                    <video controls width="100%" className="mb-4">
                        <source src={generatedReel} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <a href={generatedReel} download className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Download Reel
                    </a>
                </div>
                */}
            </main>
        </div>
    );
}

export default Reels;

