export interface IFriends {
	ids: Array<number>,
	next_cursor: number,
  next_cursor_str: number | string,
  previous_cursor: number,
  previous_cursor_str: number | string,
  total_count: number | null
}

export interface IFriendsListPage {
  users: Array<object>,
  next_cursor: number,
  next_cursor_str: number,
  previous_cursor: number,
  previous_cursor_str: number,
  total_count: number | null
}

export interface ITwitterUser {
  id_str: number,
  name: string,
  handle: string
}