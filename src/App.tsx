import React, { useCallback, useEffect, useState } from 'react';
import { IUserName } from './interface';
import { ChevronIconDown, StarIcon, TimesCirlceIcon } from './icons';
import axios, { AxiosError } from 'axios';
// import { IUserName } from './interface'

function App() {
  const [userName, setUserName] = useState("");
  const [ userNames, setUserNames] = useState<IUserName[]>([] as IUserName []);
  const [isLoading, setIsLoading] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [erroMsg, setErrorMsg] = useState('');
  const fetchData = useCallback(() => {
   setIsHit(true)
    setIsLoading(true)
    axios.get(`https://api.github.com/search/users?q=${userName}`)
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


  const onChangeShow = async (item:IUserName) => {

    const temp = [...userNames]
    const check = userNames.find((x) => x.id === item.id)
    if (check) {
      check.show  = !check.show 
      if (!check.repos) {
        const resp = await axios.get(`https://api.github.com/users/${item.login}/repos`)
        check.repos = resp.data
      }
    }
    setUserNames(temp)
  }

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
          <ul className='flex flex-col'>
            {userNames.map((item, index:number) => (
              <li className='flex flex-col gap-[10px]' key={index}>
                <button type="button" className='w-full' onClick={() => onChangeShow(item)}>
                  <div className="flex items-center justify-between bg-gray-200 p-[8px]"> 
                    <label className='text-neutral-900'>{item.login}</label> 
                    <span className={item.show ? 'transform rotate-180' : ''}>
                      <ChevronIconDown color={'#000'} />
                    </span>
                  </div>
                </button>
                <div className={`flex flex-col gap-[10px] overflow-auto pl-[20px] relativ transition-all duration-700 ${item.show? `max-h-[800px]` : 'max-h-0'}`}>
                    {item.repos && item.repos.map((repo, indexRepo:number) => (
                      <div className="flex justify-between bg-gray-300 p-[8px] items-start" key={`${index}.${indexRepo}`}>
                        <div className='flex flex-col gap-[8px] flex-1'>
                          <label className='text-[18px]/[21px] font-bold'>{repo.name}</label>
                          <p className='text-[14px]/[17px]'>{repo.description}</p>
                        </div>
                        <div className='flex items-center justify-end gap-[4px] w-[40px]'>
                          <span>{repo.stargazers_count}</span>
                          <span className=''><StarIcon color={'#000'} /></span>
                        </div>
                      </div>
                    ))}   
                </div>
            </li>
            ))}
          </ul>
          {isLoading &&
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="loading"></div>
            </div>
          }
        </div>
      </div>
      
    </div>
  );
}

export default App;
