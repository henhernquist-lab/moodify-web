'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveOnboardingData, completeOnboarding } from '../../lib/auth';
import { getCurrentUser } from '../../lib/auth';

interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
}

type EnergyPreference = string | null;

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-[#7C5CFF]' : 'bg-[#1F2230]'}`}></div>
            <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-[#7C5CFF]' : 'bg-[#1F2230]'}`}></div>
            <div className={`w-2 h-2 rounded-full ${currentStep === 3 ? 'bg-[#7C5CFF]' : 'bg-[#1F2230]'}`}></div>
            <span className="ml-2 text-sm text-gray-400">Step {currentStep} of 3</span>
        </div>
    );
};

interface FavoriteArtistsStepProps {
    onNext: () => void;
    artists: Artist[];
    setArtists: Dispatch<SetStateAction<Artist[]>>;
}

const FavoriteArtistsStep = ({ onNext, artists, setArtists }: FavoriteArtistsStepProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Artist[]>([]);
    const canNext = artists.length >= 5;

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                // Mocking Spotify API call
                console.log(`Searching for ${searchTerm}`);
                setSearchResults([
                    { id: '1', name: 'Artist One', images: [{ url: 'https://via.placeholder.com/150' }], genres: ['indie', 'rock'] },
                    { id: '2', name: 'Artist Two', images: [{ url: 'https://via.placeholder.com/150' }], genres: ['pop', 'electronic'] },
                ]);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const addArtist = (artist: Artist) => {
        if (artists.length < 10 && !artists.find(a => a.id === artist.id)) {
            setArtists([...artists, artist]);
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const removeArtist = (artistId: string) => {
        setArtists(artists.filter(a => a.id !== artistId));
    };

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">Who do you love?</h1>
            <p className="text-gray-400">Pick at least 5 artists to get started</p>
            <input
                type="text"
                placeholder="Search for an artist"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mt-4 p-2 rounded bg-[#171A22] border border-[#2A2D3E] text-white"
            />
            {searchResults.length > 0 && (
                <div className="mt-2 bg-[#11131A] rounded shadow-lg">
                    {searchResults.map(artist => (
                        <div key={artist.id} onClick={() => addArtist(artist)} className="p-2 flex items-center cursor-pointer hover:bg-[#171A22]">
                            <img src={artist.images[0].url} className="w-10 h-10 rounded-full mr-2" />
                            <div>
                                <p className="font-bold">{artist.name}</p>
                                <p className="text-sm text-gray-400">{artist.genres.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
                {artists.map(artist => (
                    <div key={artist.id} className="bg-[#171A22] rounded-full p-1 flex items-center">
                        <img src={artist.images[0].url} className="w-6 h-6 rounded-full mr-2" />
                        <span>{artist.name}</span>
                        <button onClick={() => removeArtist(artist.id)} className="ml-2 text-red-500">x</button>
                    </div>
                ))}
            </div>
            <button onClick={onNext} disabled={!canNext} className={`w-full mt-4 p-2 rounded ${canNext ? 'bg-[#7C5CFF]' : 'bg-gray-500'}`}>Next</button>
        </div>
    );
};

interface FavoriteGenresStepProps {
    onNext: () => void;
    genres: string[];
    setGenres: Dispatch<SetStateAction<string[]>>;
}

const FavoriteGenresStep = ({ onNext, genres, setGenres }: FavoriteGenresStepProps) => {
    const allGenres = ['Hip-Hop', 'Electronic', 'Indie', 'R&B', 'Rock', 'Pop', 'Jazz', 'Lo-Fi', 'Soul', 'Metal', 'Classical', 'Reggae'];
    const canNext = genres.length >= 3;

    const toggleGenre = (genre: string) => {
        if (genres.includes(genre)) {
            setGenres(genres.filter(g => g !== genre));
        } else {
            setGenres([...genres, genre]);
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">What moves you?</h1>
            <p className="text-gray-400">Choose at least 3 genres</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {allGenres.map(genre => (
                    <button 
                        key={genre} 
                        onClick={() => toggleGenre(genre)} 
                        className={`p-4 rounded ${genres.includes(genre) ? 'bg-[#7C5CFF] text-white' : 'bg-[#171A22] text-gray-400 border border-[#2A2D3E]'}`}>
                        {genre}
                    </button>
                ))}
            </div>
            <button onClick={onNext} disabled={!canNext} className={`w-full mt-4 p-2 rounded ${canNext ? 'bg-[#7C5CFF]' : 'bg-gray-500'}`}>Next</button>
        </div>
    );
};

interface EnergyPreferenceStepProps {
    onFinish: () => void;
    energy: EnergyPreference;
    setEnergy: Dispatch<SetStateAction<EnergyPreference>>;
}

const EnergyPreferenceStep = ({ onFinish, energy, setEnergy }: EnergyPreferenceStepProps) => {
    const energies = [
        { title: 'Easy & Chill', subtitle: 'Calm, slow, laid back music' },
        { title: 'Balanced', subtitle: 'A mix of everything depending on the mood' },
        { title: 'High Energy', subtitle: 'Hype, fast, loud — always at full send' },
    ];

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">How do you usually vibe?</h1>
            <p className="text-gray-400">This helps us tune your recommendations</p>
            <div className="space-y-4 mt-4">
                {energies.map(e => (
                    <div 
                        key={e.title} 
                        onClick={() => setEnergy(e.title)} 
                        className={`p-4 rounded bg-[#171A22] border ${energy === e.title ? 'border-[#7C5CFF]' : 'border-transparent'}`}>
                        <h2 className="font-bold">{e.title}</h2>
                        <p className="text-gray-400">{e.subtitle}</p>
                    </div>
                ))}
            </div>
            <button onClick={onFinish} disabled={!energy} className={`w-full mt-4 p-2 rounded ${energy ? 'bg-[#7C5CFF]' : 'bg-gray-500'}`}>Finish</button>
        </div>
    );
};

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [energy, setEnergy] = useState<EnergyPreference>(null);

    const handleFinish = async () => {
        const user = getCurrentUser();
        if (user) {
            await saveOnboardingData(user.uid, { topArtists: artists, topGenres: genres, energyPreference: energy });
            await completeOnboarding(user.uid);
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 bg-[#11131A] z-50 flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                <StepIndicator currentStep={step} />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && <FavoriteArtistsStep onNext={() => setStep(2)} artists={artists} setArtists={setArtists} />}
                        {step === 2 && <FavoriteGenresStep onNext={() => setStep(3)} genres={genres} setGenres={setGenres} />}
                        {step === 3 && <EnergyPreferenceStep onFinish={handleFinish} energy={energy} setEnergy={setEnergy} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
