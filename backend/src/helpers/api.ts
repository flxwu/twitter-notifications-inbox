import Twit from 'twit';

import { IFriends, IFriendsListPage, ITwitterUser } from '../schemas/twitApi';

/**
 * Gets all Friends, filters those with notifications on and returns ITwitterUser objects
 * @param T Twit object
 */
export const getNotificationFriends = (T: Twit): Promise<Array<ITwitterUser>> =>
  new Promise<Array<ITwitterUser>>(async (resolve, reject) => {
    const usersArray = await getFollowingUsers(T);
    const filteredArray = usersArray.reduce((filtered: Array<ITwitterUser>, user) => {
      if (user.notifications) {
        filtered.push({
          id_str: user.id_str,
          name: user.name,
          handle: user.screen_name
        });
      }
      return filtered;
		}, []);
		resolve(filteredArray);
  });

/**
 * Gets all Friends, iterates through Twitter API pages
 * @param T Twit object
 */
export const getFollowingUsers = (T: Twit): Promise<Array<object>> =>
  new Promise<Array<object>>(async (resolve, reject) => {
    let cursor = -1;
    const usersArray = [];
    while (true) {
      const usersPage = await getFollowingUsersPage(T, cursor);
      if (usersPage.next_cursor_str) {
        if (usersPage.next_cursor === 0) {
          break;
        }
        usersArray.push(...usersPage.users);
        cursor = usersPage.next_cursor_str;
      } else {
        usersArray.push(...usersPage.errors);
        break;
      }
    }
    resolve(usersArray);
  });

/**
 * Gets one page of Friends from the Twitter API
 * @param T Twit object
 * @param cursor Twitter API Page cursor (-1 for first page)
 */
export const getFollowingUsersPage = async (
  T: Twit,
  cursor: number
): Promise<IFriendsListPage> =>
  new Promise<IFriendsListPage>((resolve, reject) =>
    T.get('friends/list', { count: 200, skip_status: true, cursor }, function(
      err,
      data: IFriendsListPage
    ) {
      resolve(data);
    })
  );

/**
 * Gets Following Users, DEPRECATED
 * @param T Twit Object
 * @param ids Array of user ids
 */
export const getHundredFollowingUsers = async (
  T: Twit,
  ids: Array<number>
): Promise<Array<object>> =>
  new Promise<Array<object>>((resolve, reject) => {
    let idsString: string = ids.reduce(
      (acc, id) => (acc += `${id.toString()},`),
      ''
    );
    idsString = idsString.substring(0, idsString.length - 2); // cut off last comma
    T.get('users/lookup', { user_id: idsString }, function(
      err,
      data: Array<object>
    ) {
      resolve(data);
    });
  });

/**
 * Gets Following Users IDs, DEPRECATED
 * @param T Twit Object
 * @param ids Array of user ids
 */
export const getFollowingUsersIDs = (T: Twit): Promise<Array<number>> =>
  new Promise((resolve, reject) => {
    T.get('friends/ids', {}, function(err, data: IFriends, response) {
      const userIDs = data.ids;
      if (userIDs) return resolve(userIDs);
      reject('Error while getting Followers');
    });
  });
