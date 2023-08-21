import React from 'react';
import { Link } from 'react-router-dom';
import animationData from '../animation/animation_home.json';
import Lottie from 'react-lottie';

function LandingPage() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <div className="bg-gray-100 min-h-screen p-10 flex flex-col justify-center items-center">

            <header className="mb-10 text-center">
                <h1 className="text-5xl font-bold">Cuppa AI</h1>
                <p className="text-xl mt-2 text-gray-600">Crafting Stellar Audio Ads, Video Ads, and Reels</p>
            </header>

            <Lottie options={defaultOptions} height={400} width={400} className="mb-10" />

            <section className="flex justify-around flex-wrap w-full">
                <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white p-6">
                    <h2 className="font-bold text-xl mb-2">Audio Ads</h2>
                    <p className="text-base text-gray-600">Create captivating audio advertisements for your brand.</p>
                    <Link to="/audio-ads" className="mt-4 inline-block bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full">Get Started</Link>
                </div>

                <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white p-6">
                    <h2 className="font-bold text-xl mb-2">Video Ads</h2>
                    <p className="text-base text-gray-600">Capture your audience with stunning video content.</p>
                    <Link to="/video-ads" className="mt-4 inline-block bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full">Get Started</Link>
                </div>

                <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white p-6">
                    <h2 className="font-bold text-xl mb-2">Reels</h2>
                    <p className="text-base text-gray-600">Engage users with short and compelling video snippets.</p>
                    <Link to="/reels" className="mt-4 inline-block bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full">Get Started</Link>
                </div>
            </section>

            <footer className="mt-auto text-center text-gray-600 w-full">
                <p>&copy; 2023 Cuppa AI. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default LandingPage;
