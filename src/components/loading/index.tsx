import React from 'react'

export const SpinnerLoading = () => {
  return (
    <div 
      role="status"
      aria-label="Loading..."
      className="w-full h-full flex flex-col items-center justify-center"
    >
        <div className="loading"></div>
    </div>
  )
}
