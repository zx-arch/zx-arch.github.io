// src/components/Filter.js
import React, { useState } from 'react';

const Filter = ({ setMovie }) => {
    //const [setSelectedCategory] = useState('');

    const handleCategoryChange = async (category) => {
        if (category === 'Rating Tertinggi') {
            const URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=27bd4dad0754c77391111e35f827bd6a&language=en-US&page=1';
            const response = await fetch(URL);
            const data = await response.json();

            if (data.results) {
                setMovie(data.results);
            }
        } else if (category === 'Popular') {
            const URL = 'https://api.themoviedb.org/3/movie/popular?api_key=27bd4dad0754c77391111e35f827bd6a&language=en-US&page=1';

            const response = await fetch(URL);
            const data = await response.json();

            if (data.results) {
                setMovie(data.results);
            }
        } else if (category === 'Upcoming') {
            const URL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=27bd4dad0754c77391111e35f827bd6a&language=en-US&page=1';

            const response = await fetch(URL);
            const data = await response.json();

            if (data.results) {
                setMovie(data.results);
            }
        }
    };

    return (
        <div className='container-category'>
            <input className="dark-light" type="checkbox" id="dark-light" name="dark-light" />

            <div className="light-back"></div>

            <div className="sec-center">
                <input className="dropdown" type="checkbox" id="dropdown" name="dropdown" />
                <label className="for-dropdown" htmlFor="dropdown">Filter By<i className="uil uil-arrow-down"></i></label>
                <div className="section-dropdown">
                    <a onClick={() => handleCategoryChange('Rating Tertinggi')}>Rating Tertinggi<i className="uil uil-arrow-right"></i></a>
                    <a onClick={() => handleCategoryChange('Popular')}>Popular<i className="uil uil-arrow-right"></i></a>
                    <a onClick={() => handleCategoryChange('Upcoming')}>Upcoming<i className="uil uil-arrow-right"></i></a>
                </div>
            </div>
        </div>
    );
};

export default Filter;