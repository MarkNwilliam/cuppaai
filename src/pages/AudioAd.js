import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function AudioAd() {

  const [audioLink, setAudioLink] = useState(null);
  const [suggestedPostTime, setSuggestedPostTime] = useState(null);

    const [formData, setFormData] = useState({
        business: '',
        location: '',
        description: '',
        industry:''
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
  
      // Display a progress bar using SweetAlert
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

      // Inside handleSubmit, after setting audio link:
setSuggestedPostTime(getNextPeakTime());

    
       // Convert formData to a JSON string, assuming formData is an object
  const requestBody = JSON.stringify(formData);
console.log(requestBody)
  try {
    const response = await fetch(`https://api.mosiai.studio/app1/test_radio_ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();
    console.log(data);
    setAudioLink(data.link);


    // Close the loading SweetAlert
    Swal.close();

    // Display success message
    Swal.fire('Success!', 'Your audio ad was successfully created check below.', 'success');
  } catch (error) {
    console.error('There was an error:', error);

    // Display error message
    Swal.fire('Oops...', 'Something went wrong! Please try again.', 'error');
  }
};
return(
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
                <h1 className="text-3xl font-bold mb-6">Craft Your Audio Ad</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Tell us about your business and we'll help craft the perfect audio advertisement for your brand.
                </p>

              {/* Form */}
              <form className="bg-white shadow-md rounded p-8" onSubmit={handleSubmit}>
                {/* Business Name */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="business">
                        Business name
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="business" 
                        name="business"
                        type="text" 
                        placeholder="Enter business name" 
                        value={formData.business}
                        onChange={handleInputChange} />
                </div>

                {/* Location */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                        Location
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="location" 
                        name="location"
                        type="text" 
                        placeholder="Enter business location" 
                        value={formData.location}
                        onChange={handleInputChange} />
                </div>

                 {/* Industry */}
                 <div className="mb-6">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Industry">
    Industry
</label>

                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="Industry" 
                        name="industry"
                        type="text" 
                        placeholder="Which industry are we in" 
                        value={formData.industry}
                        onChange={handleInputChange} />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description" 
                        name="description"
                        rows="5" 
                        placeholder="Describe your business or the audio ad specifics"
                        value={formData.description}
                        onChange={handleInputChange}></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Create Ad
                    </button>
                </div>
            </form>
            </main>

            {suggestedPostTime && (
            <div className="mt-4">
                <p className="text-xl font-bold text-gray-700">Suggested Post Time:</p>
                <p className="text-lg text-gray-600">{suggestedPostTime}</p>
            </div>
        )}

            {audioLink && (
    <div className="mt-8 p-10 text-center"> {/* This will center the contents */}
        <h2 className="text-2xl font-bold mb-4">Your Audio Ad:</h2>
        <audio controls className="mx-auto block"> {/* These classes center the audio player */}
            <source src={audioLink} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <div className="mt-4">
            {/* Styling the download button */}
            <a href={audioLink} download className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full">
                Download Audio
            </a>
        </div>

        
    </div>
)}



        </div>
    );
}

export default AudioAd;

