import React from 'react';

const RatingStars = ({ rating }) => {
    const maxStars = 10; // Jumlah maksimum bintang
    const filledStars = Math.round(rating); // Hitung jumlah bintang yang akan diisi

    // Membuat array dengan panjang sesuai jumlah bintang
    const starsArray = Array.from({ length: maxStars }, (_, index) => (
        <span key={index} className={index < filledStars ? 'filled' : 'empty'}>
            &#9733; {/* Tanda bintang HTML entity */}
        </span>
    ));

    return <div className="rating-stars">{starsArray}</div>;
};

export default RatingStars;
