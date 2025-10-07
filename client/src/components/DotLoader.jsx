import React, { useState, useEffect } from 'react';

const DotLoader = () => {
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        const messages = [
            // Add your loading messages here
            'Loading',
            'Please wait',
            'Fetching data',
            'Almost there',
            'Just a moment',
            'Hold on',
            'Loading more',
            'Still loading',
            'Just a sec',
            'Loading data',
        ];

        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setLoadingMessage(messages[randomIndex]);
        }, 2000); // Change the duration as needed

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='flex items-center gap-8'>
            <div className="loader"></div>
            <div className='text-xl font-semibold'>
                {loadingMessage || 'Loading'}
            </div>
        </div>
    );
};

export default DotLoader;
