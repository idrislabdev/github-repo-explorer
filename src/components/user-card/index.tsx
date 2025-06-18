import React, { Dispatch, SetStateAction } from 'react'
import { IUserName } from '../../types/interface'
import { ChevronIconDown, StarIcon } from '../../assets/icons'
import { getUserRepos } from '../../services/github'

const UserCard = (props: {userNames:IUserName[], setUserNames:Dispatch<SetStateAction<IUserName[]>>}) => {
    const { userNames, setUserNames } = props
    const onChangeShow = async (item:IUserName) => {
        const temp = [...userNames]
        const check = userNames.find((x) => x.id === item.id)
        if (check) {
            check.show  = !check.show 
            if (!check.repos) {
                const resp = await getUserRepos(item.login);
                check.repos = resp.data
            }
        }
        setUserNames(temp)
    }
    return (
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
    )
}

export default UserCard