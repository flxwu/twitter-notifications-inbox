import * as React from 'react';

import { IUser } from '../schemas/user';
import { Text, Grid, Box } from 'grommet';

interface IProps {
  profile: IUser;
}

// interface IState {}

class NotificationInboxRoot extends React.Component<IProps, {}> {
  public render() {
    return (
      <Grid
        fill={'true'}
        rows={['auto', 'flex']}
        columns={['auto', 'flex']}
        areas={[
          { name: 'header', start: [0, 0], end: [1, 0] },
          { name: 'main', start: [1, 1], end: [1, 1] }
        ]}>
        <Box
          gridArea="header"
          direction="row"
          align="center"
          justify="between">
          <Text>Hey {this.props.profile.name}!</Text>
        </Box>
        <Box gridArea="main" justify="center" align="center">
					{this.props.children}
        </Box>
      </Grid>
    );
  }
}

export default NotificationInboxRoot;
