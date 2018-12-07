import { Box, Button, Heading } from 'grommet';
import * as React from 'react';

import './App.css';
class App extends React.Component {
  public render() {
    return (
      <Box
        align="center"
        alignContent="center"
        alignSelf="stretch"
        animation={{
          delay: 100,
          duration: 1000,
          size: 'xlarge',
          type: 'fadeIn'
        }}>
        <Heading level="2">Twitter Mobile Notifications Inbox</Heading>
        <Button primary={true} label="Login" href="/auth" />
      </Box>
    );
  }

}

export default App;
