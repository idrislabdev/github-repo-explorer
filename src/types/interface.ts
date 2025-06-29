export interface IUserName {
    "login": string,
    "id": number,
    "node_id": string,
    "avatar_url": string,
    "gravatar_id": string,
    "url": string,
    "html_url": string,
    "followers_url": string,
    "following_url": string,
    "gists_url": string,
    "starred_url": string,
    "subscriptions_url": string,
    "organizations_url": string,
    "repos_url": string,
    "events_url": string,
    "received_events_url": string,
    "type": string,
    "user_view_type": string,
    "site_admin": boolean,
    "score": 1.0,
    "repos" : IRepo[],
    "show" : boolean
}

export interface IRepo {
    "id" : number,
    "node_id" : string,
    "private" : boolean,
    "name" : string,
    "full_name" : string,
    "description" : string,
    "html_url" : string,
    "stargazers_count" : number,
    "watchers_count" : number,
}