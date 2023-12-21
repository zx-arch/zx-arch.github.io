import React from 'react';

const Searching = ({ showForm, search }) => {
    return (
        <form
            action=""
            className="search-bar"
            style={{ display: showForm ? '' : 'none' }}
            onSubmit={(e) => {
                e.preventDefault();
                const searchValue = e.target.querySelector('.MovieSearch').value;
                search(searchValue);
            }}
        >
            <input
                placeholder='Enter Film..'
                className='MovieSearch'
            />
            <button className="search-btn" type="submit">
                <span>Search</span>
            </button>
        </form>
    );
};

export default Searching;