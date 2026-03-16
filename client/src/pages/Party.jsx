import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import sword from '../assets/sword.png';
import shield from '../assets/shield.png';
import NewParty from '../components/party/NewParty';
import Fighting from '../components/party/Fighting';
import Api from '../api';
import { toast } from 'react-toastify';

const Party = () => {

    const [user, setUser] = useState();
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [partyInfo, setPartyInfo] = useState({});
    const [allJoined, setAllJoined] = useState(false);
    const [partyStarted, setPartyStarted] = useState(false);

    const [partyCode, setPartyCode] = useState('');
    const [joiningByCode, setJoiningByCode] = useState(false);

    useEffect(() => {

        setLoading(true);

        const fetchUser = async () => {

            let currUser = null;

            try {
                const resUser = await Api.getUser({ email: userInfo.email });
                currUser = resUser.data.user;
                setUser(currUser);
            } catch (error) {
                console.error(error);
            }

            if (currUser && currUser.partyId) {

                try {

                    const resParty = await Api.getParty({ partyId: currUser.partyId });

                    setPartyInfo(resParty.data.party);

                    if (resParty.data.party.isFighting) {
                        setPartyStarted(true);
                    }

                    let flag = true;

                    resParty.data.party.members.forEach((member) => {
                        if (!member.isJoined) flag = false;
                    });

                    setAllJoined(flag);

                } catch (error) {
                    console.error(error);
                }

            }

            try {

                const resAll = await Api.getAllUsers();
                setUsersList(resAll.data.users);

            } catch (error) {
                console.error(error);
            }

            setLoading(false);

        };

        fetchUser();

    }, [change]);


    const handleStartParty = async () => {

        if (!allJoined) {
            toast.error('Please wait for all members to get ready!');
            return;
        }

        try {

            await Api.startFight({ partyId: partyInfo._id });
            toast.success('Party started successfully!');
            window.location.reload();

        } catch (error) {

            toast.error('Error starting party');

        }

    };


  const handleQuitParty = async () => {

    if (!user || !partyInfo || !partyInfo._id) {
        toast.error('No party to quit.');
        return;
    }

    const confirmed = window.confirm('Are you sure you want to quit the party?');
    if (!confirmed) return;

    try {

        if (typeof Api.quitParty === 'function') {

            await Api.quitParty({
                partyId: partyInfo._id,
                email: user.email
            });

        } else if (typeof Api.leaveParty === 'function') {

            await Api.leaveParty({
                partyId: partyInfo._id,
                email: user.email
            });

        } else if (typeof Api.removeMember === 'function') {

            await Api.removeMember({
                partyId: partyInfo._id,
                email: user.email
            });

        } else {

            toast.error('Quit API not found.');
            return;

        }

        toast.success('You have left the party.');
        setChange(prev => !prev);

    } catch (error) {

        console.error('Error quitting party:', error);
        toast.error('Failed to quit party.');

    }
};

    const handleJoinByCode = async () => {

        if (!partyCode) {
            toast.error('Please enter a party code');
            return;
        }

        setJoiningByCode(true);

        try {

            const res = await Api.acceptInvite({
                email: user.email,
                partyId: partyCode
            });

            toast.success(res?.data?.message || "Joined party successfully");

            setPartyCode('');
            setChange(!change);

        } catch (error) {

            const msg = error?.response?.data?.message || "Failed to join party";
            toast.error(msg);

        }

        setJoiningByCode(false);

    };


    return (

        <div className='w-full h-screen'>

            {loading ? (

                <div className='w-full h-full flex items-center justify-center'>
                    <CircularProgress />
                </div>

            ) : (

                <div className='w-full h-full'>

                    {partyStarted ? (

                        <Fighting
                            user={user}
                            partyInfo={partyInfo}
                            change={change}
                            setChange={setChange}
                            setPartyStarted={setPartyStarted}
                        />

                    ) : (

                        <div className='w-full h-full p-6'>

                            {!user?.partyId ? (

                                <div className='w-full flex flex-col items-center gap-10'>

                                    <NewParty
                                        usersList={usersList}
                                        user={user}
                                        change={change}
                                        setChange={setChange}
                                    />


                                    {/* JOIN PARTY UI */}

                                    <div className="w-full max-w-xl flex flex-col gap-4 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">

                                        <h2 className="text-2xl font-bold text-white">
                                            Join a party with code
                                        </h2>

                                        <p className="text-gray-400 text-sm">
                                            If someone shared a party code with you, paste it below to join directly.
                                        </p>

                                        <div className="flex gap-3">

                                            <input
                                                value={partyCode}
                                                onChange={(e) => setPartyCode(e.target.value)}
                                                placeholder="Enter party code (party id)"
                                                className="
                                                w-full
                                                px-4 py-3
                                                rounded-xl
                                                bg-transparent
                                                border border-gray-600
                                                text-white
                                                placeholder-gray-400
                                                focus:outline-none
                                                focus:border-purple-500
                                                "
                                            />

                                            <button
                                                onClick={handleJoinByCode}
                                                disabled={joiningByCode}
                                                className="
                                                px-6 py-3
                                                rounded-xl
                                                font-semibold
                                                text-white
                                                bg-gradient-to-r from-blue-500 to-purple-500
                                                hover:from-blue-600 hover:to-purple-600
                                                transition-all duration-300
                                                shadow-lg
                                                "
                                            >
                                                {joiningByCode ? "Joining..." : "Join"}
                                            </button>

                                        </div>

                                        <p className="text-xs text-gray-500">
                                            Note: party codes are the party id shown to the leader.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className='w-full h-full flex flex-col items-center justify-start gap-4 mt-12'>

                                    <div className='text-3xl font-bold'>
                                        You are already in a party!
                                    </div>

                                    <div>
                                        {user.email === partyInfo.members?.[0]?.email
                                            ? "You can start the party after everyone is ready."
                                            : "Please wait for the party leader to start the party."}
                                    </div>


                                    <div className='mt-8 bg-white rounded-md shadow-lg relative flex flex-col items-center justify-center p-6 w-full max-w-3xl'>

                                        <div className='absolute top-4 right-4 flex gap-2'>

                                            {user.email === partyInfo.members?.[0]?.email && (

                                                <button
                                                    onClick={handleStartParty}
                                                    className='bg-cobalt p-2.5 rounded-md text-white'
                                                >
                                                    Start Party
                                                </button>

                                            )}

                                            <button
                                                onClick={handleQuitParty}
                                                className='bg-red-600 text-white px-3 py-2 rounded-md'
                                            >
                                                Quit
                                            </button>

                                        </div>


                                        <div className='text-2xl font-bold text-black'>
                                            Party Name: {partyInfo.partyName}
                                        </div>

                                        <div className='mt-2 text-black'>
                                            Party Leader: {partyInfo.members?.[0]?.name}
                                        </div>


                                        <div className='mt-6 w-full'>

                                            {partyInfo.members?.map((member) => (

                                                <div
                                                    key={member.email}
                                                    className='flex items-center justify-between gap-4 mx-4 my-3 p-3 rounded-md border'
                                                >

                                                    <div className='flex items-center gap-4'>

                                                        <img
                                                            src={member.gaming.avatar.image}
                                                            className='w-12 h-12 rounded-full'
                                                            alt=""
                                                        />

                                                        <div>

                                                            <div className='text-lg font-semibold text-black'>
                                                                {member.name}
                                                            </div>

                                                            <div className='text-sm text-gray-600'>
                                                                {member.email}
                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className='flex items-center gap-6'>

                                                        <div className='flex gap-1.5 items-center'>
                                                            <img src={sword} width={22} alt="" />
                                                            <span className='font-bold text-black'>
                                                                {member.gaming.avatar.attack}
                                                            </span>
                                                        </div>

                                                        <div className='flex gap-1.5 items-center'>
                                                            <img src={shield} width={22} alt="" />
                                                            <span className='font-bold text-black'>
                                                                {member.gaming.avatar.defense}
                                                            </span>
                                                        </div>

                                                        {member.isJoined ? (

                                                            <div className='bg-green-600 text-white px-3 py-1 rounded-xl'>
                                                                Ready
                                                            </div>

                                                        ) : (

                                                            <div className='bg-red-600 text-white px-3 py-1 rounded-xl'>
                                                                Not Ready
                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            )}

        </div>

    );

};

export default Party;