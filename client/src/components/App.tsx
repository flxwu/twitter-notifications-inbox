import { Box, Button, Heading } from 'grommet';
import * as React from 'react';
import { getCookie } from '../helpers/cookies';
import { IUser } from '../schemas/user';

import NotificationInboxRoot from './NotificationInboxRoot';
import NotificationsList from './NotificationsList';

interface IState {
  profile: undefined | IUser;
}

class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    const profile = getCookie('profile');
    this.state = {
      profile
    };
  }

  public render() {
    return (
      <Box
        align="center"
        alignContent="center"
        alignSelf="stretch"
        animation={{
          delay: 0,
          duration: 1000,
          size: 'xlarge',
          type: 'fadeIn'
        }}>
        <Heading level="2">Twitter Mobile Notifications Inbox</Heading>
        {this.body()}
      </Box>
    );
  }

  private body() {
    const { profile } = this.state;
    if (profile) {
      return (
        <NotificationInboxRoot profile={profile}>
          <NotificationsList />
        </NotificationInboxRoot>
      );
    } else {
      return <Button primary={true} label="Login" href="/auth" />;
    }
  }
}

export default App;
