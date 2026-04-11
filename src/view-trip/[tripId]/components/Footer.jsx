import React from 'react'

const Footer = () => {
  return (
    <div className='mt-20 pb-10 flex flex-col items-center gap-2'>
        <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
        <h2 className='text-center text-indigo-100/30 text-xs font-bold uppercase tracking-[0.3em] hover:text-amber-500/50 transition-all duration-700 cursor-default'>
            Created by <span className="text-white/40">ish.</span>
        </h2>
    </div>
  )
}

export default Footer