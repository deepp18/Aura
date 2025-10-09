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

    // new state for join-by-code
    const [partyCode, setPartyCode] = useState('');
    const [joiningByCode, setJoiningByCode] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            let currUser = null;
            try {
                const resUser = await Api.getUser({ email: userInfo.email });
                console.log('User:', resUser.data);
                currUser = resUser.data.user;
                setUser(resUser.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }

            if (currUser && currUser.partyId) {
                try {
                    const resParty = await Api.getParty({ partyId: currUser.partyId });
                    console.log('Party:', resParty.data);
                    setPartyInfo(resParty.data.party);
                    if (resParty.data.party.isFighting) {
                        setPartyStarted(true);
                    }
                    let flag = 1;
                    resParty.data.party.members.forEach((member) => {
                        if (!member.isJoined) flag = 0;
                    });
                    setAllJoined(Boolean(flag));
                } catch (error) {
                    console.error('Error fetching party:', error);
                }
            }

            try {
                const resAll = await Api.getAllUsers();
                console.log('All Users:', resAll.data);
                setUsersList(resAll.data.users);
            } catch (error) {
                console.error('Error fetching all users:', error);
            }

            setLoading(false);
        };
        fetchUser();
    }, [change]); // added change as dependency so you can trigger updates by toggling setChange

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
            console.error('Error starting party:', error);
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
            // Try common API method names in order
            if (typeof Api.quitParty === 'function') {
                await Api.quitParty({ partyId: partyInfo._id, email: user.email });
            } else if (typeof Api.leaveParty === 'function') {
                // accept both leaveParty({ email }) and leaveParty({ partyId, email })
                if (Api.leaveParty.length === 1) {
                    await Api.leaveParty({ email: user.email });
                } else {
                    await Api.leaveParty({ partyId: partyInfo._id, email: user.email });
                }
            } else if (typeof Api.removeMember === 'function') {
                await Api.removeMember({ partyId: partyInfo._id, email: user.email });
            } else if (typeof Api.updatePartyMember === 'function') {
                // fallback: some APIs use a generic update route
                await Api.updatePartyMember({ partyId: partyInfo._id, email: user.email, action: 'leave' });
            } else {
                toast.error('No API method found to quit the party. Please implement Api.quitParty or Api.leaveParty.');
                return;
            }

            toast.success('You have left the party.');
            // trigger a refresh
            setChange(prev => !prev);
        } catch (error) {
            console.error('Error quitting party:', error);
            toast.error('Failed to quit party. Try again.');
        }
    };

    // NEW: join by party code handler
    const handleJoinByCode = async () => {
        if (!partyCode || partyCode.trim() === '') {
            toast.error('Please enter a party code.');
            return;
        }
        if (!user || !user.email) {
            toast.error('User information missing. Please login again.');
            return;
        }

        setJoiningByCode(true);
        try {
            // Reuse acceptInvite (it expects { email, partyId })
            const res = await Api.acceptInvite({ email: user.email, partyId: partyCode.trim() });
            toast.success(res?.data?.message || 'Joined party successfully!');
            setPartyCode('');
            setChange(prev => !prev); // refresh UI
        } catch (err) {
            console.error('Error joining by code:', err);
            const msg = err?.response?.data?.message || 'Failed to join party. Check code.';
            toast.error(msg);
        } finally {
            setJoiningByCode(false);
        }
    };

    // debug helper so we can see why button might be hidden
    console.log('render party:', { loading, user, partyInfo });

    return (
        <div className='w-full h-screen'>
            {loading ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <CircularProgress />
                </div>
            ) : (
                <div className='w-full h-full'>
                    {partyStarted ? (
                        <Fighting user={user} partyInfo={partyInfo} change={change} setChange={setChange} />
                    ) : (
                        <div className='w-full h-full p-6'>
                            {!user?.partyId ? (
                                <div className='w-full flex flex-col items-center gap-6'>
                                    {/* Existing NewParty component (invite UI) */}
                                    <NewParty usersList={usersList} user={user} change={change} setChange={setChange} />

                                    {/* NEW: Join by Party Code card */}
                                    <div className='w-full max-w-md bg-white rounded-md shadow-md p-5'>
                                        <div className='text-xl font-semibold mb-2'>Join a party with code</div>
                                        <div className='text-sm text-gray-600 mb-4'>If someone shared a party code with you, paste it below to join directly.</div>
                                        <div className='flex gap-2'>
                                            <input
                                                value={partyCode}
                                                onChange={(e) => setPartyCode(e.target.value)}
                                                placeholder='Enter party code (party id)'
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                            />
                                            <button
                                                onClick={handleJoinByCode}
                                                disabled={joiningByCode}
                                                className='bg-cobalt text-white px-4 py-2 rounded-md hover:opacity-90'
                                            >
                                                {joiningByCode ? 'Joining...' : 'Join'}
                                            </button>
                                        </div>
                                        <div className='mt-3 text-xs text-gray-500'>
                                            Note: party codes are the party id shown to the leader (or returned by the create/invite API). If you don't have a code, ask the party leader to share it.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='w-full h-full flex flex-col items-center justify-start gap-4 mt-12'>
                                    <div className='text-3xl font-bold'>You are already in a party!</div>
                                    <div className='mt-0'>
                                        {user.email === partyInfo.members?.[0]?.email
                                            ? "You can start the party after everyone is ready."
                                            : "Please wait for the party leader to start the party."}
                                    </div>

                                    <div className='mt-8 bg-white rounded-md shadow-lg relative flex flex-col items-center justify-center p-6 w-full max-w-3xl'>

                                        {/* Top-right control area: Start + Quit */}
                                        <div className='absolute top-4 right-4 flex gap-2'>
                                            {user.email === partyInfo.members?.[0]?.email && (
                                                <button
                                                    onClick={handleStartParty}
                                                    className='bg-cobalt p-2.5 rounded-md hover:bg-d-blue active:bg-cobalt text-white'
                                                >
                                                    Start Party
                                                </button>
                                            )}
                                            {/* Quit visible to everyone in party (including leader) — change condition if needed */}
                                            <button
                                                onClick={handleQuitParty}
                                                className='bg-red-600 text-white px-3 py-2 rounded-md hover:opacity-90 active:scale-95'
                                                data-testid="quit-party-btn"
                                            >
                                                Quit
                                            </button>
                                        </div>

                                        <div className='text-2xl font-bold'>Party Name: {partyInfo.partyName}</div>
                                        <div className='mt-2'>Party Leader: {partyInfo.members?.[0]?.name}</div>

                                        <div className='mt-6 w-full'>
                                            {partyInfo.members?.map((member) => (
                                                <div
                                                    key={member.email}
                                                    className='flex items-center justify-between gap-4 mx-4 my-3 p-3 rounded-md'
                                                    style={{ border: '1px solid #e5e7eb' }}
                                                >
                                                    <div className='flex items-center gap-4'>
                                                        <img src={member.gaming.avatar.image} alt="avatar" className='w-12 h-12 rounded-full' />
                                                        <div className='flex flex-col'>
                                                            <div className='text-lg font-semibold'>{member.name}</div>
                                                            <div className='text-sm text-gray-600'>{member.email}</div>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-6'>
                                                        <div className='flex gap-1.5 items-center'>
                                                            <img src={sword} alt="sword" width={22} /> <span className='text-lg font-bold'>{member.gaming.avatar.attack}</span>
                                                        </div>
                                                        <div className='flex gap-1.5 items-center'>
                                                            <img src={shield} alt="shield" width={22} /> <span className='text-lg font-bold'>{member.gaming.avatar.defense}</span>
                                                        </div>
                                                        <div className='w-28'>
                                                            {member.isJoined ? (
                                                                <div className='font-bold text-lg bg-d-blue text-white p-2 text-center rounded-xl'>Ready</div>
                                                            ) : (
                                                                <div className='font-bold text-lg bg-red-600 text-white p-2 text-center rounded-xl'>Not Ready</div>
                                                            )}
                                                        </div>
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