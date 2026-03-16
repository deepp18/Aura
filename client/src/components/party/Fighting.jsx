import React, { useEffect, useState } from 'react';
import Bar from '../avatar/Bar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import { IconButton, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import sword from '../../assets/sword.png'
import shield from '../../assets/shield.png'
import Center from '../../animated-components/Center.jsx'

const Fighting = ({ user, partyInfo, change, setChange, setPartyStarted }) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (partyInfo.opp.health === 0) {
            setOpen(true)
        }
    }, [partyInfo])

    const handleContinue = () => {
        setOpen(false)
        setPartyStarted(false)
    }

    const handleLeaveFight = () => {
        const confirmLeave = window.confirm("Are you sure you want to leave the fight?")
        if (!confirmLeave) return

        setPartyStarted(false)
    }

    return (
        <Center>

            {open && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                >
                    <div className='text-2xl font-semibold tracking-wide flex flex-col items-center justify-center gap-2'>
                        Congratulations on Beating the {partyInfo.opp.name}!

                        <button
                            onClick={handleContinue}
                            className='bg-cobalt p-2.5 rounded-md text-xl hover:bg-d-blue'
                        >
                            Continue
                        </button>
                    </div>
                </Backdrop>
            )}

            <div className='fight-bg w-full h-full'>
                <div className='w-full h-full flex items-center justify-between p-4'>

                    {/* LEFT SIDE - PARTY MEMBERS */}
                    <div className='w-[30%] flex flex-col items-start gap-8'>
                        {partyInfo.members.map((member, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    backdropFilter: 'blur(20px)',
                                    padding: '10px',
                                    borderRadius: '1rem',
                                    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
                                    backdropFilter: 'blur( 4px )',
                                    borderRadius: '10px',
                                    border: '1px solid rgba( 255, 255, 255, 0.18 )',
                                }}
                                className='w-full flex items-center justify-start gap-4'>

                                <div className='w-full flex flex-col'>

                                    <div className='w-full text-center font-semibold text-white mb-3'>
                                        {member.name}
                                    </div>

                                    <div className='flex '>

                                        <img
                                            src={member.gaming.avatar.image}
                                            alt="avatar"
                                            className='w-[30%] h-[30%]'
                                        />

                                        <div className='w-[60%] flex flex-col items-start'>

                                            <div className='w-full flex flex-col gap-2 p-1'>

                                                <Bar
                                                    name='Health'
                                                    icon={<FavoriteIcon className='text-red-600' />}
                                                    value={member.gaming.health}
                                                    maxValue={member.gaming.maxHealth}
                                                    desc="Health bar"
                                                    barstyle="bg-red-600"
                                                />

                                                <div className='flex items-center justify-between'>

                                                    <div className='flex items-center gap-2'>
                                                        <img src={sword} width={25} />
                                                        <span className='text-lg font-bold'>{member.gaming.avatar.attack}</span>
                                                    </div>

                                                    <div className='flex items-center gap-2'>
                                                        <img src={shield} width={25} />
                                                        <span className='text-lg font-bold'>{member.gaming.avatar.defense}</span>
                                                    </div>

                                                </div>

                                            </div>

                                            <div className='w-full flex items-center justify-between'>

                                                <div className='flex items-center'>
                                                    <Tooltip arrow title="Level">
                                                        <IconButton>
                                                            <ShieldIcon className='text-[#06447c] !text-3xl' />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <span className='text-[#06447c] font-bold tracking-wide'>
                                                        Level {member.gaming.level}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>

                    {/* CENTER - BATTLE LOGS */}
                    <div
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(4px)',
                            padding: '10px',
                            borderRadius: '10px',
                            boxShadow: '0 8px 32px rgba(31,38,135,0.37)',
                            border: '1px solid rgba(255,255,255,0.18)',
                        }}
                        className='w-[40%] h-full flex flex-col items-center justify-start gap-4'
                    >

                        <div className='text-2xl font-bold text-white tracking-wide'>
                            Battle Logs
                        </div>

                        <div className='mt-4 flex flex-col items-start gap-4 overflow-y-auto'>
                            {partyInfo.logs.map((log, i) => (
                                <div key={i} className='text-white font-semibold'>
                                    {i + 1}. {log}
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT SIDE - OPPONENT */}
                    <div>

                        <div
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(4px)',
                                padding: '10px',
                                borderRadius: '10px',
                                boxShadow: '0 8px 32px rgba(31,38,135,0.37)',
                                border: '1px solid rgba(255,255,255,0.18)',
                            }}
                            className='w-full flex flex-col items-center'
                        >

                            <div className='text-white font-semibold mb-3'>
                                {partyInfo.opp.name}
                            </div>

                            <img
                                src={partyInfo.opp.image}
                                alt="enemy"
                                className='w-[50%]'
                            />

                            <Bar
                                name='Health'
                                icon={<FavoriteIcon className='text-red-600' />}
                                value={partyInfo.opp.health}
                                maxValue={partyInfo.opp.maxHealth}
                                desc="Opponent health"
                                barstyle="bg-red-600"
                            />

                        </div>

                        {/* LEAVE BUTTON */}
                        <div className='mt-4 flex justify-center'>
                            <button
                                onClick={handleLeaveFight}
                                className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700'
                            >
                                Leave Fight
                            </button>
                        </div>

                    </div>

                </div>
            </div>

        </Center>
    );
};

export default Fighting;