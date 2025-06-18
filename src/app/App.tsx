import React, { useCallback, useEffect, useState } from 'react';
import { IUserName } from '../types/interface';
import { TimesCirlceIcon } from '../assets/icons';
import { AxiosError } from 'axios';
import { searchUsers } from '../services/github';
import UserCard from '../components/user-card';
import { SpinnerLoading } from '../components/loading';

function App() {
  const [userName, setUserName] = useState("");
  const [ userNames, setUserNames] = useState<IUserName[]>([] as IUserName []);
  const [isLoading, setIsLoading] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [erroMsg, setErrorMsg] = useState('');
  const fetchData = useCallback(() => {
   setIsHit(true)
    setIsLoading(true)
    searchUsers(userName)
    .then((resp) => {
      const data = resp.data
      setIsLoading(false)
      setUserNames(data.items)
    })
    .catch((error) => {
      setIsLoading(false)
      const err = error as AxiosError
       if (err.response && err.response.data && err.response.data) {
          const errData = err.response.data
          const jsonError = JSON.parse(JSON.stringify(errData))
          setErrorMsg(jsonError.message)
      }
    })

  }, [setUserNames, userName])

  useEffect(() => {
    setErrorMsg('')
    if (userName.length === 0) {
      setIsHit(false)
      setUserNames([])
    }
  }, [userName, setIsHit])

  return (
    <div className="w-full h-screen p-[10px]">
      <div className='w-full h-full bg-white p-[10px] rounded-[4px] flex flex-col gap-[16px]'>
        <div className="flex flex-col gap-[16px]">
          <div className='relative'>
            <input 
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder='Enter username'
              className={`w-full h-[44px] text-base rounded-[4px] px-[8px] outline-none bg-gray-200 border border-gray-300 ${erroMsg !== '' ? 'border-red-600' : ''}`}
            />
            {erroMsg !== '' && <span className='text-sm text-red-600 italic'>{erroMsg}</span>}
            {userName.length > 0 && 
              <button className='absolute right-[10px] top-[17px]' onClick={() => setUserName('')}><TimesCirlceIcon color='#ef4444' /></button>
            }
          </div>
          <button 
            className='bg-blue-500 hover:bg-blue-400 text-white h-[44px] rounded-[4px] text-base' 
            onClick={() => fetchData()}
          >
            Search
          </button>
        </div>
        <div className='flex flex-col gap-[16px] overflow-auto flex-1'>
          {userNames.length > 0 && <h5 className='text-neutral-700 text-base'>Showing users for "{userName}"</h5>}
          {isHit  && userNames.length === 0 && !isLoading && <h5 className='text-neutral-700 text-base'>No result found</h5>}
          <UserCard setUserNames={setUserNames} userNames={userNames} />
          {isLoading && <SpinnerLoading />}
        </div>
      </div>
      
    </div>
  );
}

export default App;
