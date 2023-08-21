import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


function VideoAdPage() {
  const [videoAdUrl, setVideoAdUrl] = useState(null);
  const [suggestedPostTime, setSuggestedPostTime] = useState(null);
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        industry: ''
    });

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const getNextPeakTime = () => {
    const now = new Date();
    let suggestedHour = now.getDate() % 2 === 0 ? 11 : 15; // 11 AM for even dates and 3 PM for odd dates.
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, suggestedHour, 0, 0, 0);
    return nextDay.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    
      Swal.fire({
        title: 'Please wait...',
        html: 'Loading...',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        timerProgressBar: true,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      setSuggestedPostTime(getNextPeakTime());
      try {
        const requestData = {
          business: formData.businessName,
          country: "Uganda", // This value seems hardcoded for now. You might want to make it dynamic.
          userInput: formData.description,
          industry: formData.industry
        };

        console.log(requestData)
    
        const response = await fetch(`https://api.mosiai.studio/app1/generate_ad_videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        console.log(data)
        setVideoAdUrl(data.video_link);  // Assuming the video link is returned in a field named 'video_link'
    
        Swal.close();
        Swal.fire('Success!', 'Your video ad was successfully generated.', 'success');
    
      } catch (error) {
        Swal.fire('Oops...', 'Something went wrong! Please try again.', 'error');
        console.error('There was an error:', error);
      }
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
                <h1 className="text-3xl font-bold mb-6">Generate Your Video Ad with AI</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Fill in the details below and let our AI craft a captivating video ad for you.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessName">
                            Business Name
                        </label>
                        <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Industry
                        </label>
                        <textarea id="industry" name="industry" rows="3" value={formData.industry} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Generate Video Ad
                        </button>
                    </div>
                </form>

                {suggestedPostTime && (
            <div className="mt-4">
                <p className="text-xl font-bold text-gray-700">Suggested Post Time:</p>
                <p className="text-lg text-gray-600">{suggestedPostTime}</p>
            </div>
        )}

                {videoAdUrl && (
    <div className="mt-10">
        <video controls width="100%" className="mb-4">
            <source src={videoAdUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <a href={videoAdUrl} download className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Download Video Ad
        </a>
    </div>
)}



            </main>
        </div>
    );
}

export default VideoAdPage;
